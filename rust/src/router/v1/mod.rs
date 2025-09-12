use axum::Router;
mod chats;
mod users;

pub fn main() -> Router {
    let router = Router::new().merge(users::user()).merge(chats::chat());
    router
}
