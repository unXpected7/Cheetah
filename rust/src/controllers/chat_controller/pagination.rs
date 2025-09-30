use crate::AppState;
use crate::db::model::Chat;
use crate::libs::Resp;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use serde::{Deserialize, Serialize};

// Query parameters for pagination
#[derive(Deserialize)]
pub struct PaginationQuery {
    pub page: Option<i64>,
}

// Response structure with pagination metadata
#[derive(Serialize)]
pub struct PaginatedResponse<T> {
    pub data: Vec<T>,
    pub pagination: PaginationMeta,
}

#[derive(Serialize)]
pub struct PaginationMeta {
    pub current_page: i64,
    pub per_page: i64,
    pub total: i64,
    pub total_pages: i64,
    pub has_next: bool,
    pub has_prev: bool,
}

impl PaginationMeta {
    pub fn new(current_page: i64, per_page: i64, total: i64) -> Self {
        let total_pages = (total + per_page - 1) / per_page; // Ceiling division
        Self {
            current_page,
            per_page,
            total,
            total_pages,
            has_next: current_page < total_pages,
            has_prev: current_page > 1,
        }
    }
}

// Original handler with path parameter (improved)
pub async fn get_chat(State(state): State<AppState>, Path(page): Path<i64>) -> impl IntoResponse {
    let page = page.max(1); // Ensure minimum page is 1
    let limit: i64 = 100;

    let connection = &state.db;

    let total = match sqlx::query_scalar!("SELECT COUNT(*) FROM chats")
        .fetch_one(connection)
        .await
    {
        Ok(count) => {
            if count.is_none() {
                return Resp::success(
                    "No chats available",
                    Some(PaginatedResponse {
                        data: vec![],
                        pagination: PaginationMeta::new(page, 100, 0),
                    }),
                );
            }
            let count = count.unwrap_or(0);
            count
        }
        Err(err) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Resp::error(format!("Database error: {}", err)),
            );
        }
    };

    let offset = (page - 1) * limit;

    let query = r#"
    select 
    c.*, 
    json_build_object(
        'nickname', u.nickname, 'userId', 
        u.id, 'avatar', u.avatar, 'email', 
        u.email
    ) as user, 
    json_build_object(
        'id', r.id, 'message', r.message, 'attachment', 
        r.attachment
    ) as reply 
    FROM 
    chats as c 
    INNER JOIN users as u on c."userId" = u.id 
    LEFT JOIN chats as r on r.id = c."replyId" 
    limit $1 offset $2;"#;

    let results = sqlx::query_as::<_, Chat>(query)
        .bind(limit)
        .bind(offset)
        .fetch_all(connection)
        .await;

    match results {
        Ok(rows) => {
            return Resp::success(
                "fetching success",
                Some(PaginatedResponse {
                    data: rows,
                    pagination: PaginationMeta::new(page, 1, total),
                }),
            );
        }
        Err(err) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Resp::error(err.to_string()),
            );
        }
    }
}
