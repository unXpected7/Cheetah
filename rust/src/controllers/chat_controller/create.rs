use crate::AppState;
use crate::db::model::Chat;
use crate::libs::Resp;
use crate::extract::UserId;
use axum::extract::{Json, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use serde::{Deserialize, Serialize};
use sqlx::Pool;
use sqlx::Postgres;

#[derive(Deserialize)]
pub struct CreateChatRequest {
    pub message: String,
    pub attachment: Option<String>,
    pub reply_id: Option<i64>,
}

#[derive(Serialize)]
pub struct CreateChatResponse {
    pub id: i64,
    pub message: String,
    pub attachment: Option<String>,
    pub user_id: i64,
    pub reply_id: Option<i64>,
    pub created_at: String,
}

pub async fn create_chat(
    State(state): State<AppState>,
    UserId(user_id): UserId,
    Json(params): Json<CreateChatRequest>,
) -> impl IntoResponse {
    // Validate message
    if params.message.trim().is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Resp::error("Message cannot be empty"),
        );
    }

    let connection = &state.db;

    // Insert new chat message
    let query = r#"
        INSERT INTO chats (message, attachment, "userId", "replyId", created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id, message, attachment, "userId" as user_id, "replyId" as reply_id, created_at
    "#;

    let result = sqlx::query_as::<_, CreateChatResponse>(query)
        .bind(&params.message)
        .bind(params.attachment.clone())
        .bind(user_id) // Use actual user ID from JWT
        .bind(params.reply_id)
        .fetch_one(connection)
        .await;

    match result {
        Ok(chat) => {
            // TODO: Emit Socket.IO event for new message
            Resp::success("Message created successfully", Some(chat))
        }
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Resp::error(format!("Failed to create message: {}", err)),
        ),
    }
}