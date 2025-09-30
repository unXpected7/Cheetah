use crate::AppState;
use crate::libs::Resp;
use crate::extract::UserId;
use axum::extract::{State, Json};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use serde::{Deserialize, Serialize};
use sqlx::Pool;
use sqlx::Postgres;

#[derive(Deserialize)]
pub struct LogoutRequest {
    pub refresh_token: String,
}

pub async fn logout_user(
    State(state): State<AppState>,
    UserId(user_id): UserId,
    Json(params): Json<LogoutRequest>,
) -> impl IntoResponse {
    let connection = &state.db;

    // Invalidate the refresh token by setting it to NULL
    let result = sqlx::query(
        "UPDATE users SET refresh_token = NULL WHERE id = $1 AND refresh_token = $2"
    )
    .bind(user_id)
    .bind(&params.refresh_token)
    .execute(connection)
    .await;

    match result {
        Ok(_) => Resp::success("User logged out successfully", None::<()>),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Resp::error(format!("Failed to logout: {}", err)),
        ),
    }
}

// Alternative logout without refresh token (just invalidate the user's refresh token)
pub async fn logout_user_simple(
    State(state): State<AppState>,
    UserId(user_id): UserId,
) -> impl IntoResponse {
    let connection = &state.db;

    let result = sqlx::query(
        "UPDATE users SET refresh_token = NULL WHERE id = $1"
    )
    .bind(user_id)
    .execute(connection)
    .await;

    match result {
        Ok(_) => Resp::success("User logged out successfully", None::<()>),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Resp::error(format!("Failed to logout: {}", err)),
        ),
    }
}