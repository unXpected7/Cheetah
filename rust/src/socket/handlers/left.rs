use crate::socket::handlers::UserSocketMap;
use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};
use serde_json::Value;
use tracing::info;

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