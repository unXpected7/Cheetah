use axum::{
    Router,
    routing::{get, post},
};

use crate::controllers::user_controller::{self, check, users::get_one_user};

pub fn user() -> Router {
    let router = Router::new()
        .route(
            "/v1/register",
            post(user_controller::register::register_user),
        )
        .route("/v1/login", post(user_controller::login::login_by_email))
        .route("/v1/user/check", post(check::check_available))
        .route("/v1/user/{nickname}", get(get_one_user));
    router
}
