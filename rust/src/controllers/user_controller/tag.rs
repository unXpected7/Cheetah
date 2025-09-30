use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
};
use serde::Serialize;

use crate::{AppState, libs::Resp};

#[derive(Serialize, sqlx::FromRow)]
pub struct Nickname {
    nickname: String,
}

pub async fn get_tag(State(state): State<AppState>, Path(tag): Path<String>) -> impl IntoResponse {
    let split_tag: &str = match tag.strip_prefix("@") {
        Some(str) => str.trim(),
        None => return (StatusCode::OK, Resp::error("user not found")),
    };

    let result =
        sqlx::query_as::<_, Nickname>("select nickname from users where nickname ilike $1")
            .bind(format!("%{}%", split_tag))
            .fetch_all(&state.db)
            .await;

    match result {
        Ok(users) => {
            let nicknames: Vec<String> = users.iter().map(|data| data.nickname.clone()).collect();
            return Resp::success("get tags success", Some(nicknames));
        }
        Err(err) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Resp::error(err.to_string()),
            );
        }
    }
}
