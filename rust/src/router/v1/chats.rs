use axum::{Router, routing::get};

use crate::controllers::chat_controller;

pub fn chat() -> Router {
    let router = Router::new().route(
        "/v1/chat/page/{page}",
        get(chat_controller::pagination::get_chat),
    );
    router
}
