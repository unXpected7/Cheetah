use crate::AppState;
use crate::libs::Resp;
use crate::extract::UserId;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use sqlx::Pool;
use sqlx::Postgres;

pub async fn delete_chat(
    State(state): State<AppState>,
    UserId(user_id): UserId,
    Path(chat_id): Path<i64>,
) -> impl IntoResponse {
    let connection = &state.db;

    // First check if the message exists and belongs to the user (TODO: Add user ID check from JWT)
    let check_query = "SELECT id FROM chats WHERE id = $1 AND \"userId\" = $2";
    let exists = sqlx::query_scalar(check_query)
        .bind(chat_id)
        .bind(user_id) // Use actual user ID from JWT
        .fetch_optional(connection)
        .await;

    match exists {
        None => (
            StatusCode::NOT_FOUND,
            Resp::error("Message not found or access denied"),
        ),
        Some(_) => {
            // Delete the message
            let delete_query = "DELETE FROM chats WHERE id = $1 AND \"userId\" = $2";
            let result = sqlx::query(delete_query)
                .bind(chat_id)
                .bind(user_id) // Use actual user ID from JWT
                .execute(connection)
                .await;

            match result {
                Ok(_) => Resp::success("Message deleted successfully", None::<()>),
                Err(err) => (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Resp::error(format!("Failed to delete message: {}", err)),
                ),
            }
        }
    }
}