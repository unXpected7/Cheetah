use axum::Router;

use crate::AppState;
mod chats;
mod users;

pub fn main() -> Router<AppState> {
    let router = Router::new().merge(users::user()).merge(chats::chat());
    router
}
