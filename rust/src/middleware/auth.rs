use crate::libs::{Resp, crypto::verify_jwt};
use axum::{Json, extract::Request, http::StatusCode, middleware::Next, response::IntoResponse};

pub async fn middleware_auth(
    req: Request,
    next: Next,
) -> Result<impl IntoResponse, (StatusCode, Json<Resp<String>>)> {
    let token_bearer = req.headers().get("Authorization");
    if token_bearer.is_none() {
        Err((
            StatusCode::UNAUTHORIZED,
            Resp::error("Authorization header is empty"),
        ))
    } else {
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
        Ok(next.run(req).await)
    }
}
