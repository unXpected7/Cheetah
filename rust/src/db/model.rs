use chrono::{DateTime, Utc};
use diesel::prelude::*;
use uuid::Uuid;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::db::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[derive(Debug)]
pub struct User {
    pub id: i64,
    pub email: Option<String>,
    pub avatar: Option<String>,
    pub nickname: Option<String>,
    #[diesel(column_name = "socketId")]
    pub socketId: Option<String>,
    #[diesel(column_name = "authId")]
    pub authId: Option<Uuid>,
    #[diesel(column_name = "updated_at")]
    pub updated_at: Option<DateTime<Utc>>, // Changed to match Timestamptz
    #[diesel(column_name = "created_at")]
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Identifiable, Selectable, Queryable, Associations, Debug, Clone)]
#[diesel(table_name = crate::db::schema::chats)]
#[diesel(belongs_to(User, foreign_key = userId))]
#[diesel(belongs_to(Chat, foreign_key = replyId))]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Chat {
    pub id: i64,
    pub message: Option<String>,
    pub attachment: Option<String>,
    #[diesel(column_name = "updated_at")]
    pub updated_at: Option<DateTime<Utc>>, // Changed to match Timestamptz
    #[diesel(column_name = "created_at")]
    pub created_at: Option<DateTime<Utc>>, // Changed to match Timestamptz
    #[diesel(column_name = "userId")]
    pub userId: Option<i64>,
    #[diesel(column_name = "replyId")]
    pub replyId: Option<i64>,
}
