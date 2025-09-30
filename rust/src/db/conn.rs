use std::env;

use dotenvy::dotenv;
use sqlx::{Pool, Postgres, postgres::PgPoolOptions};

use crate::AppState;

pub async fn create_connection() -> Pool<Postgres> {
    dotenv().ok();
    let database_url = match env::var("DATABASE_URL") {
        Ok(url) => url,
        Err(_) => {
            eprintln!("DATABASE_URL environment variable not set");
            std::process::exit(1);
        }
    };

    match PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
    {
        Ok(pool) => pool,
        Err(e) => {
            eprintln!("Failed to connect to database: {}", e);
            std::process::exit(1);
        }
    }
}
