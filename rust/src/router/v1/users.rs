use axum::{
    Router,
    routing::{get, post},
};

use crate::controllers::user_controller;

pub fn user() -> Router {
    let router = Router::new()
        .route(
            "/v1/register",
            post(user_controller::register::register_user),
        )
        .route("/v1/login", post(user_controller::login::login_by_email));
    router
}
