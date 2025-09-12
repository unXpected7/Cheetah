mod v1;
use axum::{Router, middleware::from_fn};

use crate::middleware::logger::middleware_logger;

pub fn main() -> Router {
    let router = Router::new()
        .merge(v1::main())
        .layer(from_fn(middleware_logger));
    router
}
