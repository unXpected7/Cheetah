use crate::libs::{Resp, crypto::verify_jwt};
use axum::{Json, extract::Request, http::StatusCode, middleware::Next, response::IntoResponse};
use std::collections::HashMap;

// Extract user ID from JWT and add to extensions
pub async fn middleware_auth(
    req: Request,
    next: Next,
) -> Result<impl IntoResponse, (StatusCode, Json<Resp<String>>)> {
    let token_bearer = req.headers().get("Authorization");
    if token_bearer.is_none() {
        return Err((
            StatusCode::UNAUTHORIZED,
            Resp::error("Authorization header is empty"),
        ));
    }

    let token_bearer = token_bearer.unwrap();
    let token_bearer_str = token_bearer.to_str().expect("failed to change to string");
    let token = match token_bearer_str.strip_prefix("Bearer ") {
        Some(token) => token.trim(),
        None => {
            return Err((
                StatusCode::UNAUTHORIZED,
                Resp::error("Invalid token format. Expected: Bearer <token>"),
            ));
        }
    };

    let verified = verify_jwt(token);
    if !verified.result {
        return Err((StatusCode::UNAUTHORIZED, Resp::error(verified.reason)));
    }

    // Extract user ID from verified JWT token
    let user_id = verified.extract_user_id();

    // Add user ID to request extensions
    let mut extensions = req.extensions().clone();
    extensions.insert("user_id", user_id);

    // Create new request with extensions
    let mut req_with_ext = req;
    req_with_ext = req_with_ext.with_extensions(extensions);

    Ok(next.run(req_with_ext).await)
}

// Add extension trait for user ID extraction
pub trait JwtExt {
    fn user_id(&self) -> i64;
}

impl JwtExt for axum::extract::Request {
    fn user_id(&self) -> i64 {
        self.extensions()
            .get::<i64>()
            .copied()
            .unwrap_or(0) // Should be 0 for development, but should have proper error handling
    }
}
