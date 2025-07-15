use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::db::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: i64,
    pub email: String,
    pub avatar: String,
    pub nickname: String,
    #[diesel(column_name = "socketId")]
    pub socketId: String,
    #[diesel(column_name = "authId")]
    pub authId: String,
    #[diesel(column_name = "updatedAt")]
    pub updatedAt: String,
    #[diesel(column_name = "createdAt")]
    pub createdAt: String,
}

#[derive(Identifiable, Selectable, Queryable, Associations, Debug, Clone)]
#[diesel(table_name = crate::db::schema::chats)]
#[diesel(belongs_to(User, foreign_key = userId))]
#[diesel(belongs_to(Chat, foreign_key = replyId))]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Chat {
    pub id: i64,
    pub message: String,
    pub attachment: String,
    #[diesel(column_name = "userId")]
    pub userId: i64,
    #[diesel(column_name = "replyId")]
    pub replyId: i64,
    #[diesel(column_name = "updatedAt")]
    pub updatedAt: String,
    #[diesel(column_name = "createdAt")]
    pub createdAt: String,
}
