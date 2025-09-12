use crate::db::{conn::create_connection, model::User};

pub async fn get_user_by_auth_id(user_id: i64) -> Option<User> {
    let connection = create_connection().await;

    let results = sqlx::query_as::<_, User>("SELECT * FROM users where id = $1")
        .bind(user_id)
        .fetch_one(&connection)
        .await;

    connection.close().await;

    match results {
        Ok(user) => Some(user),
        Err(e) => {
            eprintln!("Error loading user: {}", e);
            None
        }
    }
}

pub async fn get_user_by_email(email: String, nickname: String) -> Option<User> {
    let connection = create_connection().await;

    let results =
        sqlx::query_as::<_, User>("SELECT * FROM users where email = $1 OR nickname = $2")
            .bind(email)
            .bind(nickname)
            .fetch_one(&connection)
            .await;

    connection.close().await;

    match results {
        Ok(user) => Some(user),
        Err(e) => {
            eprintln!("Error loading user: {}", e);
            None
        }
    }
}
