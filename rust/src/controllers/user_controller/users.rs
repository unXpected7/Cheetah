use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
};

use crate::{AppState, db::model::User, libs::Resp};

pub async fn get_one_user(
    State(state): State<AppState>,
    nickname: Path<String>,
) -> impl IntoResponse {
    let connection = &state.db;

    let results = sqlx::query_as::<_, User>("SELECT * FROM users where nickname = $1")
        .bind(nickname.to_string())
        .fetch_one(connection)
        .await;

    match results {
        Ok(user) => {
            return Resp::success("Ok", Some(user));
        }
        Err(err) => {
            return (
                StatusCode::SERVICE_UNAVAILABLE,
                Resp::error(err.to_string()),
            );
        }
    }
}
