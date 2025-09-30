use crate::AppState;
use crate::db::model::User;
use crate::libs::{Resp, crypto::generate_jwt};
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use sqlx::Pool;
use sqlx::Postgres;

#[derive(serde::Serialize)]
pub struct RefreshTokenResponse {
    pub token: String,
    pub refresh_token: String,
}

pub async fn refresh_token(
    State(state): State<AppState>,
    refresh_token: String,
) -> impl IntoResponse {
    let connection = &state.db;

    // Find user with this refresh token
    let user = sqlx::query_as::<_, User>(
        "SELECT id, email, nickname, avatar FROM users WHERE refresh_token = $1"
    )
    .bind(&refresh_token)
    .fetch_optional(connection)
    .await;

    match user {
        Some(user) => {
            // Generate new tokens
            match generate_jwt(user.id) {
                Ok(new_tokens) => {
                    // Update refresh token in database
                    let update_result = sqlx::query(
                        "UPDATE users SET refresh_token = $1 WHERE id = $2"
                    )
                    .bind(&new_tokens.refresh_token)
                    .bind(user.id)
                    .execute(connection)
                    .await;

                    match update_result {
                        Ok(_) => Resp::success(
                            "Token refreshed successfully",
                            Some(RefreshTokenResponse {
                                token: new_tokens.token,
                                refresh_token: new_tokens.refresh_token,
                            }),
                        ),
                        Err(err) => (
                            StatusCode::INTERNAL_SERVER_ERROR,
                            Resp::error(format!("Failed to update refresh token: {}", err)),
                        ),
                    }
                }
                Err(err) => (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Resp::error(format!("Failed to generate new tokens: {}", err)),
                ),
            }
        }
        None => (
            StatusCode::UNAUTHORIZED,
            Resp::error("Invalid refresh token"),
        ),
    }
}