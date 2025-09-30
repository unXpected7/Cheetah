use axum::http::StatusCode;
use serde::Serialize;
pub mod avatar;
pub mod crypto;

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
