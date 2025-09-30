use axum::{body::Body, extract::State, http::StatusCode, Json};
use serde_json::Value;
use rust::AppState;
use rust::controllers::user_controller::{check, login};
use std::collections::HashMap;

// Mock AppState for testing
struct MockAppState {
    db: MockDatabase,
}

struct MockDatabase {
    users: HashMap<String, User>,
}

#[derive(Debug, Clone)]
struct User {
    id: i64,
    email: String,
    nickname: String,
    password: Option<String>,
}

impl MockAppState {
    fn new() -> Self {
        Self {
            db: MockDatabase {
                users: HashMap::new(),
            },
        }
    }
}

#[tokio::test]
async fn test_check_available_both_fields_none() {
    let app_state = MockAppState::new();
    let params = serde_json::json!({
        "email": None::<String>,
        "nickname": None::<String>
    });

    let request = Request::new(Body::empty());
    let result = check(State(app_state), Json(params as Value)).await;

    match result {
        (status, _) => {
            assert_eq!(status, StatusCode::BAD_REQUEST);
        }
    }
}

#[tokio::test]
async fn test_check_available_email_provided() {
    let app_state = MockAppState::new();
    let params = serde_json::json!({
        "email": "test@example.com",
        "nickname": None::<String>
    });

    let request = Request::new(Body::empty());
    let result = check(State(app_state), Json(params as Value)).await;

    // This should not panic and should handle the None nickname appropriately
    match result {
        (status, _) => {
            // Should not be a bad request since email is provided
            assert_ne!(status, StatusCode::BAD_REQUEST);
        }
    }
}

// Helper function to create a test request
fn Request<B>(body: B) -> axum::extract::Request<B> {
    axum::extract::Request::new(body)
}