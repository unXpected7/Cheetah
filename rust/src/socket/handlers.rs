use crate::AppState;
use crate::db::model::Chat;
use crate::libs::Resp;
use socketioxide::{
    extract::{AckSender, Data, SocketRef},
    SocketIo,
};
use sqlx::Pool;
use sqlx::Postgres;
use serde_json::Value;

// Store user socket mappings
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

pub type UserSocketMap = Arc<RwLock<HashMap<String, SocketRef>>>;

pub async fn handle_join(
    socket: SocketRef,
    io: SocketIo,
    Data(data): Data<Value>,
    user_sockets: UserSocketMap,
) {
    let user_id = data["userId"].as_i64().unwrap_or(0);
    let nickname = data["nickname"].as_str().unwrap_or("Anonymous");

    info!("User {} ({}) joined", nickname, user_id);

    // Store socket mapping
    {
        let mut sockets = user_sockets.write().await;
        sockets.insert(user_id.to_string(), socket.clone());
    }

    // Join user to a room (could be specific chat room or general)
    socket.join("general_chat").ok();

    // Notify other users
    socket
        .to("general_chat")
        .emit("user_joined", serde_json::json!({
            "userId": user_id,
            "nickname": nickname,
            "message": format!("{} joined the chat", nickname)
        }))
        .ok();

    // Send acknowledgment
    socket.emit("joined", serde_json::json!({
        "status": "success",
        "message": "Successfully joined the chat"
    })).ok();
}

pub async fn handle_left(
    socket: SocketRef,
    io: SocketIo,
    Data(data): Data<Value>,
    user_sockets: UserSocketMap,
) {
    let user_id = data["userId"].as_i64().unwrap_or(0);
    let nickname = data["nickname"].as_str().unwrap_or("Anonymous");

    info!("User {} ({}) left", nickname, user_id);

    // Remove from socket mapping
    {
        let mut sockets = user_sockets.write().await;
        sockets.remove(&user_id.to_string());
    }

    // Leave room
    socket.leave("general_chat").ok();

    // Notify other users
    socket
        .to("general_chat")
        .emit("user_left", serde_json::json!({
            "userId": user_id,
            "nickname": nickname,
            "message": format!("{} left the chat", nickname)
        }))
        .ok();
}

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

pub async fn handle_writing(
    socket: SocketRef,
    io: SocketIo,
    Data(data): Data<Value>,
) {
    let user_id = data["userId"].as_i64().unwrap_or(0);
    let nickname = data["nickname"].as_str().unwrap_or("Anonymous");

    // Broadcast typing indicator
    socket
        .to("general_chat")
        .emit("user_typing", serde_json::json!({
            "userId": user_id,
            "nickname": nickname,
            "typing": true
        }))
        .ok();
}

pub async fn handle_cancel_writing(
    socket: SocketRef,
    io: SocketIo,
    Data(data): Data<Value>,
) {
    let user_id = data["userId"].as_i64().unwrap_or(0);

    // Broadcast typing stop
    socket
        .to("general_chat")
        .emit("user_typing", serde_json::json!({
            "userId": user_id,
            "typing": false
        }))
        .ok();
}

// Helper functions
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