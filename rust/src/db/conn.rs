use std::env;

use dotenvy::dotenv;
use sqlx::{Pool, Postgres, postgres::PgPoolOptions};

use crate::AppState;

pub async fn create_connection() -> Pool<Postgres> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await;
    pool.expect(&format!("failed to connect database om {}", database_url))
}
