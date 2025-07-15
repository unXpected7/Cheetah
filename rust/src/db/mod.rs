use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

use crate::db::{model::User, schema::users};
pub mod model;
pub mod schema;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn get_user() {
    let connection = &mut establish_connection();
    match users::table
        .select(User::as_select())
        .first::<User>(connection)
    {
        Ok(user) => println!("Found user: {:?}", user), // Adjust field names as per your User struct
        Err(e) => println!("Error loading user: {}", e),
    }
}
