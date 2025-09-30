use axum::http::StatusCode;
use serde::Serialize;
pub mod avatar;
pub mod crypto;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(String),
    #[error("Authentication error: {0}")]
    Auth(String),
    #[error("Validation error: {0}")]
    Validation(String),
    #[error("Internal server error: {0}")]
    Internal(String),
}

impl AppError {
    pub fn database<S: Into<String>>(s: S) -> Self {
        Self::Database(s.into())
    }

    pub fn auth<S: Into<String>>(s: S) -> Self {
        Self::Auth(s.into())
    }

    pub fn validation<S: Into<String>>(s: S) -> Self {
        Self::Validation(s.into())
    }

    pub fn internal<S: Into<String>>(s: S) -> Self {
        Self::Internal(s.into())
    }
}

impl axum::response::IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let (status, error_message) = match self {
            AppError::Database(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
            AppError::Auth(msg) => (StatusCode::UNAUTHORIZED, msg),
            AppError::Validation(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };

        (status, axum::Json(Resp {
            msg: error_message,
            data: None,
            success: false,
        }))
    }
}

pub type AppResult<T> = Result<T, AppError>;

#[derive(Debug, Serialize)]
pub struct Resp<T> {
    pub msg: String,
    pub data: Option<T>,
    pub success: bool,
}

impl<T> Resp<T> {
    pub fn success(
        msg: impl Into<String>,
        data: Option<T>,
    ) -> (axum::http::StatusCode, axum::Json<Self>) {
        (
            StatusCode::OK,
            axum::Json(Resp {
                msg: msg.into(),
                data,
                success: true,
            }),
        )
    }

    pub fn error(msg: impl Into<String>) -> axum::Json<Self> {
        axum::Json(Resp {
            msg: msg.into(),
            data: None,
            success: false,
        })
    }
}
