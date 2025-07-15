// @generated automatically by Diesel CLI.
diesel::table! {
    users (id) {
        id -> Int8,
        title -> Varchar,
        body -> Text,
        published -> Bool,
        email -> Text,
        avatar -> Text,
        nickname -> Text,
        socketId -> Text,
        authId -> Text,
        updatedAt -> Text,
        createdAt -> Text,
    }
}

diesel::table! {
    chats (id) {
        id -> Int8,
        message -> Text,
        attachment -> Text,
        userId -> Int8,
        replyId -> Int8,
        updatedAt -> Text,
        createdAt -> Text,
    }
}

diesel::joinable!(chats -> users (userId));

diesel::allow_tables_to_appear_in_same_query!(users, chats);
