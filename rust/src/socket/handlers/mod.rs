pub mod join;
pub mod left;
pub mod chat;
pub mod writing;
pub mod cancel_writing;

pub type UserSocketMap = std::sync::Arc<tokio::sync::RwLock<std::collections::HashMap<String, socketioxide::extract::SocketRef>>>;

// Re-export handlers for easier use
pub use join::handle_join;
pub use left::handle_left;
pub use chat::handle_chat;
pub use writing::handle_writing;
pub use cancel_writing::handle_cancel_writing;