use axum::{
    Router,
    routing::{get, post},
};

use crate::{
    AppState,
    controllers::user_controller::{self, check, users::get_one_user},
};

pub fn user() -> Router<AppState> {
    let router = Router::new()
        .route("/register", post(user_controller::register::register_user))
        .route("/login", post(user_controller::login::login_by_email))
        .route("/user/check", post(check::check_available))
        .route("/user/{nickname}", get(get_one_user));
    router
}
