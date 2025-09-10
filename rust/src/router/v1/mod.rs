use axum::Router;
mod users;

pub fn main() -> Router {
    let router = Router::new().merge(users::user());
    router
}
