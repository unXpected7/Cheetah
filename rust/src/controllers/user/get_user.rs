use crate::db::establish_connection;
use crate::db::schema::users::dsl::*;

pub fn get_user_by_auth_id(id: Int8) -> Option<User> {
    let connection = establish_connection();
    let result = users
        .filter(auth_id.eq(int))
        .first::<User>(&connection)
        .optional()
        .expect("Error loading user");

    result
}
