use std::env;

use argon2::password_hash::SaltString;
use base64::{Engine, engine::general_purpose as b64};
use chrono::{Duration, TimeDelta, Utc};
use dotenvy::dotenv;
use hmac::{Hmac, Mac};
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use serde_json;
use sha2::Sha256;

type HmacSha256 = Hmac<Sha256>;

#[derive(Serialize, Deserialize, Debug)]
struct JwtHeader {
    alg: String,
    typ: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct JwtBody {
    id: i64,
    iat: i64,
    exp: i64,
    jti: String,
}

fn create_hmac_signature(
    message: &str,
    secret: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    let mut mac = HmacSha256::new_from_slice(secret.as_bytes())?;
    mac.update(message.as_bytes());
    let result = mac.finalize();
    Ok(b64::URL_SAFE_NO_PAD.encode(result.into_bytes()))
}

fn jwt(id: i64, duration: TimeDelta) -> Result<String, Box<dyn std::error::Error>> {
    dotenv().ok();
    let secret = env::var("SECRET")?;

    // Header
    let header = JwtHeader {
        alg: "HS256".to_string(),
        typ: "https://youtu.be/xvFZjo5PgG0".to_string(),
    };
    let header_json = serde_json::to_string(&header)?;
    let header_b64 = b64::URL_SAFE_NO_PAD.encode(header_json);
    let salt = SaltString::generate(&mut OsRng);

    // Body/Payload
    let now = Utc::now();
    let exp_time = now + duration;
    let jwt_body_struct = JwtBody {
        id,
        iat: now.timestamp(),
        exp: exp_time.timestamp(),
        jti: salt.as_str().to_string(),
    };
    let jwt_body_json = serde_json::to_string(&jwt_body_struct)?;
    let jwt_body_b64 = b64::URL_SAFE_NO_PAD.encode(jwt_body_json);

    // Create message to sign (header.payload)
    let message = format!("{}.{}", header_b64, jwt_body_b64);

    // Create HMAC signature
    let signature = create_hmac_signature(&message, &secret)?;

    // Return complete JWT
    Ok(format!("{}.{}", message, signature))
}

pub struct VerifyJwt {
    pub result: bool,
    pub reason: String,
    pub user_id: Option<i64>,
}

impl VerifyJwt {
    pub fn extract_user_id(&self) -> i64 {
        self.user_id.unwrap_or(0)
    }
}

pub fn verify_jwt(token: &str) -> VerifyJwt {
    let secret = env::var("SECRET").expect("env secret not found");

    let parts: Vec<&str> = token.split('.').collect();
    if parts.len() != 3 {
        return VerifyJwt {
            result: false,
            reason: "Invalid Token format".to_string(),
            user_id: None,
        };
    }

    let (header_b64, payload_b64, signature_b64) = (parts[0], parts[1], parts[2]);

    // Verify signature
    let message = format!("{}.{}", header_b64, payload_b64);
    let expected_signature = match create_hmac_signature(&message, &secret) {
        Ok(sign) => sign,
        Err(err) => {
            return VerifyJwt {
                result: false,
                reason: err.to_string(),
                user_id: None,
            };
        }
    };

    if signature_b64 != expected_signature {
        return VerifyJwt {
            result: false,
            reason: "Invalid Signature".to_string(),
            user_id: None,
        };
    }

    // Decode and verify payload
    let payload_json = match b64::URL_SAFE_NO_PAD.decode(payload_b64) {
        Ok(vector) => vector,
        Err(err) => {
            return VerifyJwt {
                result: false,
                reason: err.to_string(),
                user_id: None,
            };
        }
    };

    let payload: JwtBody = match serde_json::from_slice(&payload_json) {
        Ok(json_body) => json_body,
        Err(err) => {
            return VerifyJwt {
                result: false,
                reason: err.to_string(),
                user_id: None,
            };
        }
    };

    // Check expiration
    let now = Utc::now().timestamp();
    if payload.exp < now {
        return VerifyJwt {
            result: false,
            reason: "Token Expired".to_string(),
            user_id: None,
        };
    } else {
        return VerifyJwt {
            result: true,
            reason: "Ok".to_string(),
            user_id: Some(payload.id),
        };
    }
}

pub struct GenerateJWt {
    pub token: String,
    pub refresh_token: String,
}

pub fn generate_jwt(id: i64) -> Result<GenerateJWt, Box<dyn std::error::Error>> {
    let token = jwt(id, Duration::hours(1))?;
    let refresh_token = jwt(id, Duration::days(30))?;

    Ok(GenerateJWt {
        token,
        refresh_token,
    })
}
