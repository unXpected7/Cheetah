use axum::{
    Router,
    middleware::from_fn,
    routing::{get, post},
};

use crate::{
    AppState,
    controllers::user_controller::{self, check, logout, refresh_token, tag, users::get_one_user},
    middleware::auth::middleware_auth,
};

pub fn user() -> Router<AppState> {
    let protected_routes = Router::new()
        .route("/check", post(check::check_available))
        .route("/{nickname}", get(get_one_user))
        .route("/tag/{tag}", get(tag::get_tag))
        .route("/logout", post(logout::logout_user))
        .layer(from_fn(middleware_auth));

    let router = Router::new()
        .route("/register", post(user_controller::register::register_user))
        .route("/login", post(user_controller::login::login_by_email))
        .route("/refresh", post(refresh_token::refresh_token))
        .nest("/user", protected_routes);
    router
}
