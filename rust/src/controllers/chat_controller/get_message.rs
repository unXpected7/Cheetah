use crate::AppState;
use crate::db::model::Chat;
use crate::libs::Resp;
use crate::extract::UserId;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use sqlx::Pool;
use sqlx::Postgres;

pub async fn get_chat_by_id(
    State(state): State<AppState>,
    Path(chat_id): Path<i64>,
) -> impl IntoResponse {
    let connection = &state.db;

    let query = r#"
        SELECT
            c.*,
            json_build_object(
                'nickname', u.nickname,
                'userId', u.id,
                'avatar', u.avatar,
                'email', u.email
            ) as user,
            json_build_object(
                'id', r.id,
                'message', r.message,
                'attachment', r.attachment
            ) as reply
        FROM chats as c
        INNER JOIN users as u on c."userId" = u.id
        LEFT JOIN chats as r on r.id = c."replyId"
        WHERE c.id = $1
    "#;

    let result = sqlx::query_as::<_, Chat>(query)
        .bind(chat_id)
        .fetch_optional(connection)
        .await;

    match result {
        Some(chat) => Resp::success("Chat message retrieved", Some(chat)),
        None => (
            StatusCode::NOT_FOUND,
            Resp::error("Chat message not found"),
        ),
    }
}