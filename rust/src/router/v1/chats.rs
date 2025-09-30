use axum::{Router, middleware::from_fn, routing::{get, post, delete}};

use crate::{AppState, controllers::chat_controller, middleware::auth::middleware_auth};

pub fn chat() -> Router<AppState> {
    let router = Router::new()
        // Chat pagination
        .route(
            "/chat/page/{page}",
            get(chat_controller::pagination::get_chat),
        )
        // Create new message
        .route(
            "/chat",
            post(chat_controller::create::create_chat),
        )
        // Get specific message
        .route(
            "/chat/{id}",
            get(chat_controller::get_message::get_chat_by_id),
        )
        // Delete message
        .route(
            "/chat/{id}",
            delete(chat_controller::delete_message::delete_chat),
        )
        // Reply to message
        .route(
            "/chat/{id}/reply",
            post(chat_controller::reply_message::reply_to_chat),
        )
        .layer(from_fn(middleware_auth));
    router
}
