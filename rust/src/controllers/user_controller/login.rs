use crate::controllers::user_controller::get_user::get_user_by_email;
use crate::db::establish_connection;
use crate::db::model::User;
use crate::db::schema::users::dsl::*;
use crate::libs::Resp;
use crate::libs::crypto::generate_jwt;
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use axum::extract::Json;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper};
use serde::Deserialize;

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

fn update_user_refresh_token(
    user_id: i64,
    new_refresh_token: String,
) -> Result<bool, diesel::result::Error> {
    println!("Attempting to update refresh token for user: {}", user_id);
    println!("New refresh token: {}", new_refresh_token);

    let connection = &mut establish_connection();

    // First, verify the user exists
    let user_exists = users
        .find(user_id)
        .select(User::as_select())
        .first::<User>(connection);

    match user_exists {
        Ok(_) => println!("User {} found in database", user_id),
        Err(e) => {
            println!("User {} not found: {:?}", user_id, e);
            return Err(e);
        }
    }

    // Perform the update
    let updated_rows = diesel::update(users.find(user_id))
        .set(refresh_token.eq(Some(new_refresh_token.clone()))) // Use Some() for nullable field
        .execute(connection)?;

    println!("Updated rows: {}", updated_rows);

    if updated_rows > 0 {
        println!("Successfully updated refresh token for user: {}", user_id);

        // Verify the update worked by reading it back
        let updated_user = users
            .find(user_id)
            .select(User::as_select())
            .first::<User>(connection)?;

        println!("Stored refresh token: {:?}", updated_user.refresh_token);
    } else {
        println!("No rows were updated for user: {}", user_id);
    }

    Ok(updated_rows > 0)
}

pub async fn save_refresh_token(user_id: i64, new_refresh_token: String) {
    println!("Current thread: {:?}", std::thread::current().id());
    match tokio::task::spawn_blocking(move || {
        println!("Blocking task thread: {:?}", std::thread::current().id());
        update_user_refresh_token(user_id, new_refresh_token)
    })
    .await
    {
        Ok(db_result) => match db_result {
            Ok(true) => {
                println!("✅ [Handle] Refresh token saved for user: {}", user_id);
            }
            Ok(false) => {
                eprintln!("❌ [Handle] No rows updated for user: {}", user_id);
            }
            Err(e) => {
                eprintln!("❌ [Handle] Database error: {}", e);
            }
        },
        Err(e) => {
            eprintln!("❌ [Handle] Task execution error: {}", e);
        }
    }
}

//main function
pub async fn login_by_email(Json(params): Json<UserLogin>) -> impl IntoResponse {
    if params.email.is_empty() || params.password.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Resp::error("Email and password are required"),
        );
    }

    let user = match get_user_by_email(params.email.clone()) {
        Some(user) => user,
        None => {
            return (StatusCode::UNAUTHORIZED, Resp::error("Email not found"));
        }
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
                tokio::spawn(save_refresh_token(user.id, res.refresh_token.clone()));
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
