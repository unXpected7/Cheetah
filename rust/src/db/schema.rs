// @generated automatically by Diesel CLI.

use diesel::dsl::Nullable;

diesel::table! {
    chats (id) {
        id -> Int8,
        message -> Nullable<Text>,
        attachment -> Nullable<Text>,
        userId -> Nullable<Int8>,
        replyId -> Nullable<Int8>,
        updated_at -> Nullable<Timestamptz>,
        created_at -> Nullable<Timestamptz>,
        user->Nullable<Text>

    }
}

diesel::table! {
    users (id) {
        id -> Int8,
        email -> Nullable<Text>,
        avatar -> Nullable<Text>,
        nickname -> Nullable<Text>,
        socketId -> Nullable<Text>,
        password -> Nullable<Text>,
        refresh_token -> Nullable<Text>,
        chatId -> Nullable<Int8>,
        authId -> Nullable<Uuid>,
        updated_at -> Nullable<Timestamptz>,
        created_at -> Nullable<Timestamptz>,
    }
}

diesel::joinable!(chats -> users (userId));

diesel::allow_tables_to_appear_in_same_query!(chats, users,);
