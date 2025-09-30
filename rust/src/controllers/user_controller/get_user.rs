use sqlx::{Pool, Postgres};

use crate::db::model::User;

pub async fn get_user_by_auth_id(user_id: i64, db: Pool<Postgres>) -> Option<User> {
    let connection = &db;

    let results = sqlx::query_as::<_, User>("SELECT * FROM users where id = $1")
        .bind(user_id)
        .fetch_one(connection)
        .await;

    match results {
        Ok(user) => Some(user),
        Err(e) => {
            eprintln!("Error loading user: {}", e);
            None
        }
    }
}

pub async fn get_user_by_email(
    email: String,
    nickname: String,
    db: Pool<Postgres>,
) -> Option<User> {
    let connection = &db;

    let results =
        sqlx::query_as::<_, User>("SELECT * FROM users where email = $1 OR nickname = $2")
            .bind(email)
            .bind(nickname)
            .fetch_one(connection)
            .await;

    match results {
        Ok(user) => Some(user),
        Err(e) => {
            eprintln!("Error loading user: {}", e);
            None
        }
    }
}
