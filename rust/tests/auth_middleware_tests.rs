use axum::{body::Body, extract::Request, http::StatusCode};
use rust::middleware::auth::middleware_auth;
use tower::ServiceBuilder;
use tower_http::cors::CorsLayer;

#[tokio::test]
async fn test_auth_middleware_missing_header() {
    let request = Request::new(Body::empty());
    let next = tower::service::ServiceExt::ready(())
        .await
        .unwrap();

    let result = middleware_auth(request, next).await;

    match result {
        Err((status, _)) => {
            assert_eq!(status, StatusCode::UNAUTHORIZED);
        }
        Ok(_) => panic!("Should have failed with missing auth header"),
    }
}

#[tokio::test]
async fn test_auth_middleware_invalid_header() {
    use http::HeaderValue;

    let mut request = Request::new(Body::empty());
    request.headers_mut().insert(
        "Authorization",
        HeaderValue::from_static("InvalidHeader"),
    );

    let next = tower::service::ServiceExt::ready(())
        .await
        .unwrap();

    let result = middleware_auth(request, next).await;

    match result {
        Err((status, _)) => {
            assert_eq!(status, StatusCode::UNAUTHORIZED);
        }
        Ok(_) => panic!("Should have failed with invalid auth header"),
    }
}

#[tokio::test]
async fn test_jwt_ext_trait() {
    use rust::middleware::auth::JwtExt;
    use axum::extract::Request;

    let mut request = Request::new(Body::empty());
    request.extensions_mut().insert(42i64);

    assert_eq!(request.user_id(), 42);

    // Test with no extension
    let request_without_extension = Request::new(Body::empty());
    assert_eq!(request_without_extension.user_id(), 0);
}