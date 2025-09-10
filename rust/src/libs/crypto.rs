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

fn verify_jwt(token: &str, secret: &str) -> Result<JwtBody, Box<dyn std::error::Error>> {
    let parts: Vec<&str> = token.split('.').collect();
    if parts.len() != 3 {
        return Err("Invalid token format".into());
    }

    let (header_b64, payload_b64, signature_b64) = (parts[0], parts[1], parts[2]);

    // Verify signature
    let message = format!("{}.{}", header_b64, payload_b64);
    let expected_signature = create_hmac_signature(&message, secret)?;

    if signature_b64 != expected_signature {
        return Err("Invalid signature".into());
    }

    // Decode and verify payload
    let payload_json = b64::URL_SAFE_NO_PAD.decode(payload_b64)?;
    let payload: JwtBody = serde_json::from_slice(&payload_json)?;

    // Check expiration
    let now = Utc::now().timestamp();
    if payload.exp < now {
        return Err("Token expired".into());
    }

    Ok(payload)
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
