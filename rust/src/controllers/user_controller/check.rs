use axum::{Json, http::StatusCode, response::IntoResponse};
use serde::Deserialize;

use crate::{controllers::user_controller::get_user::get_user_by_email, libs::Resp};

#[derive(Deserialize)]
pub struct CheckParams {
    pub email: Option<String>,
    pub nickname: Option<String>,
}

pub async fn check_available(Json(params): Json<CheckParams>) -> impl IntoResponse {
    let email = params.email;
    let nickname: Option<String> = params.nickname;
    if email.is_none() && nickname.is_none() {
        return (StatusCode::BAD_REQUEST, Resp::error("body can't be empty"));
    }
    let email = email.unwrap();
    let nickname = nickname.unwrap();

    let result = get_user_by_email(email, nickname).await;

    if result.is_none() {
        return Resp::success("user not found", result);
    } else {
        return (StatusCode::OK, Resp::error("user already exist"));
    };
}
