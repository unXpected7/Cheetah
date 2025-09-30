use crate::socket::handlers::UserSocketMap;
use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};
use serde_json::Value;
use tracing::info;

pub async fn handle_writing(
    socket: SocketRef,
    io: SocketIo,
    Data(data): Data<Value>,
) {
    let user_id = data["userId"].as_i64().unwrap_or(0);
    let nickname = data["nickname"].as_str().unwrap_or("Anonymous");

    info!("User {} is typing", user_id);

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