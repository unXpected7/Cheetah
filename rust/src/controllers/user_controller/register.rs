use diesel::prelude::Insertable;
use diesel::query_dsl::methods::{FindDsl, SelectDsl};
use diesel::{RunQueryDsl, SelectableHelper};

use crate::db::establish_connection;
use crate::db::model::User;
use crate::db::schema::users;
use crate::lib::Resp;

pub struct UserRegistration {
    pub nickname: String,
    pub email: String,
    pub password: String,
}

#[derive(Insertable, Debug)]
#[diesel(table_name = users)]
struct NewUser<'a> {
    pub email: Option<&'a str>,
    pub nickname: Option<&'a str>,
    pub password: Option<&'a str>,
}

pub fn register_user(params: UserRegistration) -> Resp<User> {
    let connection = &mut establish_connection();
    let new_user = NewUser {
        email: Some(&params.email),
        nickname: Some(&params.nickname),
        password: Some(&params.password),
    };
    let results = diesel::insert_into(users::table)
        .values(&new_user)
        .returning(User::as_returning())
        .get_result(connection);
    match results {
        Ok(user) => Resp::success("User registered successfully", Some(user)),
        Err(e) => {
            eprintln!("Error registering user: {}", e);
            Resp::error(e.to_string())
        }
    }
}
