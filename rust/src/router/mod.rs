mod v1;
use axum::{Router, middleware::from_fn};

use crate::{AppState, middleware::logger::middleware_logger};

pub fn main() -> Router<AppState> {
    let router = Router::new()
        .nest("/v1", v1::main())
        .layer(from_fn(middleware_logger));
    router
}
