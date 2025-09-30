use crate::AppState;
use crate::libs::Resp;
use crate::libs::avatar::AvatarType;
use crate::libs::avatar::generate_avatar;
use argon2::{
    Argon2,
    password_hash::{PasswordHasher, SaltString, rand_core::OsRng},
};
use axum::extract::Json;
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct UserRegistration {
    pub nickname: String,
    pub email: String,
    pub password: String,
    pub avatar: Option<String>,
}

pub async fn register_user(
    State(state): State<AppState>,
    Json(params): Json<UserRegistration>,
) -> impl IntoResponse {
    let connection = &state.db;
    let password = params.password.as_bytes();
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let avatar = params.avatar.unwrap_or(generate_avatar(
        params.nickname.clone(),
        AvatarType::Identicon,
    ));
    let password_hash = match argon2
        .hash_password(password, &salt)
    {
        Ok(hash) => hash.to_string(),
        Err(e) => {
            eprintln!("Failed to hash password: {}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Resp::error("Failed to hash password"),
            );
        }
    };

    let results =
        sqlx::query("INSERT INTO users (email, nickname, password, avatar) VALUES ($1,$2,$3,$4)")
            .bind(params.email)
            .bind(params.nickname)
            .bind(password_hash)
            .bind(avatar)
            .execute(connection)
            .await;
    match results {
        Ok(row) => Resp::success("User registered successfully", None::<()>),
        Err(e) => {
            eprintln!("Error registering user: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Resp::error(e.to_string()),
            )
        }
    }
}
