use axum::{Json, extract::State, http::StatusCode, response::IntoResponse};
use serde::Deserialize;

use crate::{AppState, controllers::user_controller::get_user::get_user_by_email, libs::Resp};

#[derive(Deserialize)]
pub struct CheckParams {
    pub email: Option<String>,
    pub nickname: Option<String>,
}

pub async fn check_available(
    State(state): State<AppState>,
    Json(params): Json<CheckParams>,
) -> impl IntoResponse {
    let email = params.email;
    let nickname: Option<String> = params.nickname;
    if email.is_none() && nickname.is_none() {
        return (StatusCode::BAD_REQUEST, Resp::error("body can't be empty"));
    }
    let email = match email {
        Some(email) => email,
        None => return (StatusCode::BAD_REQUEST, Resp::error("Email is required")),
    };
    let nickname = match nickname {
        Some(nickname) => nickname,
        None => return (StatusCode::BAD_REQUEST, Resp::error("Nickname is required")),
    };

    let result = get_user_by_email(email, nickname, state.db).await;

    if result.is_none() {
        return Resp::success("user not found", result);
    } else {
        return (StatusCode::OK, Resp::error("user already exist"));
    };
}
