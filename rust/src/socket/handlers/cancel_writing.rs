use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};
use serde_json::Value;
use tracing::info;

pub async fn handle_cancel_writing(
    socket: SocketRef,
    io: SocketIo,
    Data(data): Data<Value>,
) {
    let user_id = data["userId"].as_i64().unwrap_or(0);

    info!("User {} stopped typing", user_id);

    // Broadcast typing stop
    socket
        .to("general_chat")
        .emit("user_typing", serde_json::json!({
            "userId": user_id,
            "typing": false
        }))
        .ok();
}