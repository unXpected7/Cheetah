use crate::AppState;
use crate::db::model::Chat;
use crate::socket::handlers::UserSocketMap;
use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};
use sqlx::Pool;
use sqlx::Postgres;
use serde_json::Value;
use tracing::info;

pub async fn handle_chat(
    socket: SocketRef,
    io: SocketIo,
    Data(data): Data<Value>,
    db: Pool<Postgres>,
    user_sockets: UserSocketMap,
) {
    let user_id = data["userId"].as_i64().unwrap_or(0);
    let message = data["message"].as_str().unwrap_or("");
    let reply_id = data["replyId"].as_i64();

    if message.trim().is_empty() {
        socket.emit("error", "Message cannot be empty").ok();
        return;
    }

    info!("User {} sent message: {}", user_id, message);

    // Save message to database
    let chat_result = save_chat_message(&db, user_id, message, reply_id).await;

    match chat_result {
        Ok(chat) => {
            // Get user info for the message
            let user_info = get_user_info(&db, user_id).await;

            let chat_data = serde_json::json!({
                "id": chat.id,
                "message": chat.message,
                "attachment": chat.attachment,
                "userId": user_id,
                "nickname": user_info.nickname,
                "avatar": user_info.avatar,
                "replyId": reply_id,
                "createdAt": chat.created_at,
                "user": user_info
            });

            // Broadcast to all users in the room
            socket
                .to("general_chat")
                .emit("new_message", chat_data)
                .ok();

            // Acknowledge receipt
            socket.emit("message_sent", chat_data).ok();
        }
        Err(err) => {
            socket.emit("error", format!("Failed to send message: {}", err)).ok();
        }
    }
}

// Helper function to save chat message
async fn save_chat_message(
    db: &Pool<Postgres>,
    user_id: i64,
    message: &str,
    reply_id: Option<i64>,
) -> Result<Chat, Box<dyn std::error::Error>> {
    let query = r#"
        INSERT INTO chats (message, "userId", "replyId", created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING id, message, attachment, "userId", "replyId", created_at, updated_at
    "#;

    let chat = sqlx::query_as::<_, Chat>(query)
        .bind(message)
        .bind(user_id)
        .bind(reply_id)
        .fetch_one(db)
        .await?;

    Ok(chat)
}

// Helper function to get user info
#[derive(serde::Serialize)]
struct UserInfo {
    id: i64,
    nickname: Option<String>,
    avatar: Option<String>,
}

async fn get_user_info(db: &Pool<Postgres>, user_id: i64) -> UserInfo {
    let query = "SELECT id, nickname, avatar FROM users WHERE id = $1";

    match sqlx::query_as::<_, UserInfo>(query)
        .bind(user_id)
        .fetch_optional(db)
        .await
    {
        Ok(Some(user)) => user,
        _ => UserInfo {
            id: user_id,
            nickname: Some("Unknown".to_string()),
            avatar: None,
        },
    }
}