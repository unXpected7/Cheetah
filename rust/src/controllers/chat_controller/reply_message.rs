use crate::AppState;
use crate::db::model::Chat;
use crate::libs::Resp;
use crate::extract::UserId;
use axum::extract::{Json, Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use serde::{Deserialize, Serialize};
use sqlx::Pool;
use sqlx::Postgres;

#[derive(Deserialize)]
pub struct ReplyChatRequest {
    pub message: String,
    pub attachment: Option<String>,
}

#[derive(Serialize)]
pub struct ReplyChatResponse {
    pub id: i64,
    pub message: String,
    pub attachment: Option<String>,
    pub user_id: i64,
    pub reply_id: i64,
    pub created_at: String,
}

pub async fn reply_to_chat(
    State(state): State<AppState>,
    UserId(user_id): UserId,
    Path(original_id): Path<i64>,
    Json(params): Json<ReplyChatRequest>,
) -> impl IntoResponse {
    // Validate message
    if params.message.trim().is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Resp::error("Message cannot be empty"),
        );
    }

    let connection = &state.db;

    // Check if the original message exists
    let original_exists = sqlx::query_scalar("SELECT id FROM chats WHERE id = $1")
        .bind(original_id)
        .fetch_optional(connection)
        .await;

    match original_exists {
        None => (
            StatusCode::NOT_FOUND,
            Resp::error("Original message not found"),
        ),
        Some(_) => {
            // Insert reply message
            let query = r#"
                INSERT INTO chats (message, attachment, "userId", "replyId", created_at, updated_at)
                VALUES ($1, $2, $3, $4, NOW(), NOW())
                RETURNING id, message, attachment, "userId" as user_id, "replyId" as reply_id, created_at
            "#;

            let result = sqlx::query_as::<_, ReplyChatResponse>(query)
                .bind(&params.message)
                .bind(params.attachment.clone())
                .bind(user_id) // Use actual user ID from JWT
                .bind(original_id)
                .fetch_one(connection)
                .await;

            match result {
                Ok(reply) => Resp::success("Reply created successfully", Some(reply)),
                Err(err) => (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Resp::error(format!("Failed to create reply: {}", err)),
                ),
            }
        }
    }
}