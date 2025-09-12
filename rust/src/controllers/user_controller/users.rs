use axum::{extract::Path, http::StatusCode, response::IntoResponse};

use crate::{
    controllers::user_controller::get_user::{get_user_by_auth_id, get_user_by_email},
    db::{conn::create_connection, model::User},
    libs::Resp,
};

pub async fn get_one_user(nickname: Path<String>) -> impl IntoResponse {
    let connection = create_connection().await;

    let results = sqlx::query_as::<_, User>("SELECT * FROM users where nickname = $1")
        .bind(nickname.to_string())
        .fetch_one(&connection)
        .await;

    connection.close().await;

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
