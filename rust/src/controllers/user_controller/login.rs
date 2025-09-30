use crate::AppState;
use crate::controllers::user_controller::get_user::get_user_by_email;
use crate::db::model::User;
use crate::libs::Resp;
use crate::libs::crypto::generate_jwt;
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use axum::extract::{Json, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use serde::Deserialize;
use sqlx::{Pool, Postgres};

#[derive(Deserialize)]
pub struct UserLogin {
    pub email: String,
    pub password: String,
}

#[derive(serde::Serialize)]
pub struct LoginResponse {
    pub user: Option<User>,
    pub token: String,
    pub refresh_token: String,
}

fn update_user_refresh_token(user_id: i64, new_refresh_token: String, db: Pool<Postgres>) {
    println!("Attempting to update refresh token for user: {}", user_id);
    // This blocks the current thread - avoid in async contexts
    let rt = tokio::runtime::Handle::current();
    rt.block_on(async {
        let connection = &db;

        let update_query = sqlx::query("UPDATE users SET refresh_token = $1 WHERE id = $2") // Fixed SQL
            .bind(new_refresh_token)
            .bind(user_id)
            .execute(connection)
            .await;

        match update_query {
            Ok(row) => {
                println!(
                    "Success updating user {}, {} row affected",
                    user_id,
                    row.rows_affected()
                )
            }
            Err(e) => {
                println!(
                    "Error while trying to update: user {}, reason : {}",
                    user_id,
                    e.to_string()
                );
            }
        }
    });
}

pub async fn save_refresh_token(user_id: i64, new_refresh_token: String, db: Pool<Postgres>) {
    println!("Current thread: {:?}", std::thread::current().id());
    match tokio::task::spawn_blocking(move || {
        println!("Blocking task thread: {:?}", std::thread::current().id());
        update_user_refresh_token(user_id, new_refresh_token, db);
    })
    .await
    {
        Ok(_) => {
            println!("✅ [Handle] multi thread execution success");
        }
        Err(e) => {
            eprintln!("❌ [Handle] multi thread execution error: {}", e);
        }
    }
}

//main function
pub async fn login_by_email(
    State(state): State<AppState>,
    Json(params): Json<UserLogin>,
) -> impl IntoResponse {
    if params.email.is_empty() || params.password.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Resp::error("Email and password are required"),
        );
    }

    let user =
        get_user_by_email(params.email.clone(), params.email.clone(), state.db.clone()).await;

    if user.is_none() {
        return (StatusCode::BAD_REQUEST, Resp::error("User not found"));
    }

    let user = match user {
        Some(user) => user,
        None => return (StatusCode::BAD_REQUEST, Resp::error("User not found")),
    };

    let password_valid = match &user.password {
        Some(hashed_password) => match PasswordHash::new(hashed_password) {
            Ok(parsed_hash) => Argon2::default()
                .verify_password(params.password.as_bytes(), &parsed_hash)
                .is_ok(),
            Err(_) => {
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Resp::error("Authentication error"),
                );
            }
        },
        None => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Resp::error("Authentication error"),
            );
        }
    };
    if password_valid {
        let jwt = generate_jwt(user.id);
        match jwt {
            Ok(res) => {
                tokio::spawn(save_refresh_token(
                    user.id,
                    res.refresh_token.clone(),
                    state.db.clone(),
                ));
                return Resp::success(
                    "Login Success",
                    Some(LoginResponse {
                        user: Some(user),
                        token: res.token, // or jwt.token if it has a field named token
                        refresh_token: res.refresh_token,
                    }),
                );
            }
            Err(e) => (StatusCode::UNAUTHORIZED, Resp::error(e.to_string())),
        }
    } else {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Resp::error("Wrong password"),
        )
    }
}
