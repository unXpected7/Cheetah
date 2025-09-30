use axum::{Router, middleware::from_fn, routing::get};

use crate::{AppState, controllers::chat_controller, middleware::auth::middleware_auth};

pub fn chat() -> Router<AppState> {
    let router = Router::new()
        .route(
            "/chat/page/{page}",
            get(chat_controller::pagination::get_chat),
        )
        .layer(from_fn(middleware_auth));
    router
}
