use crate::AppState;
use crate::socket::handlers::UserSocketMap;
use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};
use serde_json::Value;
use tracing::info;

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