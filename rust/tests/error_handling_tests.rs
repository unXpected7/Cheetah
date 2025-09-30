use rust::libs::{AppError, Resp};
use axum::http::StatusCode;

#[tokio::test]
async fn test_app_error_responses() {
    // Test database error
    let db_error = AppError::database("Connection failed");
    let response = db_error.into_response();

    assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);

    // Test authentication error
    let auth_error = AppError::auth("Invalid token");
    let response = auth_error.into_response();

    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);

    // Test validation error
    let validation_error = AppError::validation("Invalid input");
    let response = validation_error.into_response();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);

    // Test internal error
    let internal_error = AppError::internal("Server error");
    let response = internal_error.into_response();

    assert_eq!(response.status(), StatusCode::INTERNAL_SERVER_ERROR);
}

#[tokio::test]
async fn test_resp_success() {
    let (status, resp_json) = Resp::success("Success message", Some("test_data"));

    assert_eq!(status, StatusCode::OK);
    assert!(resp_json.success);
    assert_eq!(resp_json.msg, "Success message");
    assert_eq!(resp_json.data, Some("test_data"));
}

#[tokio::test]
async fn test_resp_error() {
    let resp_json = Resp::error("Error message");

    assert!(resp_json.success);
    assert_eq!(resp_json.msg, "Error message");
    assert_eq!(resp_json.data, None);
}