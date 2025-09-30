use axum::{
    Router,
    middleware::from_fn,
    routing::{get, post},
};

use crate::{
    AppState,
    controllers::user_controller::{self, check, tag, users::get_one_user},
    middleware::auth::middleware_auth,
};

pub fn user() -> Router<AppState> {
    let protected_routes = Router::new()
        .route("/check", post(check::check_available))
        .route("/{nickname}", get(get_one_user))
        .route("/tag/{tag}", get(tag::get_tag))
        .layer(from_fn(middleware_auth));

    let router = Router::new()
        .route("/register", post(user_controller::register::register_user))
        .route("/login", post(user_controller::login::login_by_email))
        .nest("/user", protected_routes);
    router
}
