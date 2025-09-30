use axum::extract::FromRequest;
use axum::http::Request;
use axum::body::Body;
use axum::response::{IntoResponse, Response};
use crate::middleware::auth::JwtExt;
use std::future::Future;
use std::pin::Pin;

#[derive(Debug, Clone)]
pub struct UserId(pub i64);

impl<S> FromRequest<S> for UserId
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, &'static str);

    fn from_request(req: Request<Body>, _state: &S) -> Self::Future {
        let user_id = req.user_id();
        let future = async move {
            if user_id == 0 {
                Err((StatusCode::UNAUTHORIZED, "Invalid user ID"))
            } else {
                Ok(UserId(user_id))
            }
        };
        Box::pin(future)
    }
}

impl UserId {
    pub fn get(&self) -> i64 {
        self.0
    }
}