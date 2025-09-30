use chrono::{DateTime, Utc};
use serde::Serialize;

#[derive(Serialize, sqlx::FromRow)]
pub struct User {
    pub id: i64,
    pub email: Option<String>,
    pub avatar: Option<String>,
    pub nickname: Option<String>,
    pub password: Option<String>,
    pub refresh_token: Option<String>,
    #[serde(rename = "socketId")]
    #[sqlx(rename = "socketId")]
    pub socket_id: Option<String>,
    #[serde(rename = "authId")]
    #[sqlx(rename = "authId")]
    pub auth_id: Option<String>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct Chat {
    pub id: i64,
    pub message: Option<String>,
    pub attachment: Option<String>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_at: Option<DateTime<Utc>>,
    #[serde(rename = "userId")]
    #[sqlx(rename = "userId")]
    pub user_id: Option<i64>,
    #[serde(rename = "replyId")]
    #[sqlx(rename = "replyId")]
    pub reply_id: Option<i64>,
    pub user: Option<User>,
    pub reply: Option<Chat>,
}
