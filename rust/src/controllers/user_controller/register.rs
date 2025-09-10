use crate::db::model::User;
use crate::db::schema::users;
use crate::libs::Resp;
use crate::libs::avatar::AvatarType;
use crate::{db::establish_connection, libs::avatar::generate_avatar};
use argon2::{
    Argon2,
    password_hash::{PasswordHasher, SaltString, rand_core::OsRng},
};
use axum::extract::Json;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use diesel::prelude::Insertable;
use diesel::{RunQueryDsl, SelectableHelper};
use serde::Deserialize;
#[derive(Deserialize)]
pub struct UserRegistration {
    pub nickname: String,
    pub email: String,
    pub password: String,
    pub avatar: Option<String>,
}

#[derive(Insertable, Debug)]
#[diesel(table_name = users)]
struct NewUser<'a> {
    pub email: &'a str,
    pub nickname: &'a str,
    pub password: &'a str,
    pub avatar: &'a str,
}

pub async fn register_user(Json(params): Json<UserRegistration>) -> impl IntoResponse {
    let connection = &mut establish_connection();
    let password = params.password.as_bytes();
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let avatar = params.avatar.unwrap_or(generate_avatar(
        params.nickname.clone(),
        AvatarType::Identicon,
    ));
    let password_hash = argon2
        .hash_password(password, &salt)
        .expect("Failed to hash password")
        .to_string();
    let new_user = NewUser {
        email: &params.email,
        nickname: &params.nickname,
        password: &password_hash,
        avatar: &avatar,
    };
    let results = diesel::insert_into(users::table)
        .values(&new_user)
        .returning(User::as_returning())
        .get_result(connection);
    match results {
        Ok(user) => Resp::success("User registered successfully", Some(user)),
        Err(e) => {
            eprintln!("Error registering user: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Resp::error(e.to_string()),
            )
        }
    }
}
