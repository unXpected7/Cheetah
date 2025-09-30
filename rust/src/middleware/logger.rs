use axum::{extract::Request, middleware::Next, response::IntoResponse};

pub async fn middleware_logger(req: Request, next: Next) -> impl IntoResponse {
    println!("[{}]route:{}", req.method(), req.uri());
    next.run(req).await
}
