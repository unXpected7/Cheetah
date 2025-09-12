use axum::{Router, middleware::from_fn, routing::get};

use crate::{controllers::chat_controller, middleware::auth::middleware_auth};

pub fn chat() -> Router {
    let router = Router::new()
        .route(
            "/v1/chat/page/{page}",
            get(chat_controller::pagination::get_chat),
        )
        .layer(from_fn(middleware_auth));
    router
}
