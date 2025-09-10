mod v1;
use axum::Router;

pub fn main() -> Router {
    let router = Router::new().merge(v1::main());
    router
}
