use axum::{Router, routing::get};
use serde_json::Value;
use socketioxide::{
    SocketIo,
    extract::{AckSender, Data, SocketRef},
};
use sqlx::{Pool, Postgres};
use tower::ServiceBuilder;
use tower_http::cors::CorsLayer;
use tracing::info;
use tracing_subscriber::FmtSubscriber;

use crate::db::conn::create_connection;
use crate::socket::handlers::{handle_join, handle_left, handle_chat, handle_writing, handle_cancel_writing};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

mod controllers;
mod db;
mod extract;
mod libs;
mod middleware;
mod router;
mod socket;

fn on_connect(
    socket: SocketRef,
    Data(data): Data<Value>,
    app_state: AppState,
    user_sockets: UserSocketMap,
) {
    info!("Socket.IO connected: {:?} {:?}", socket.ns(), socket.id);
    socket.emit("auth", &data).ok();

    // Handle join event
    socket.on("join", move |socket: SocketRef, Data::<Value>(data)| {
        let app_state = app_state.clone();
        let user_sockets = user_sockets.clone();
        handle_join(socket, SocketIo::new(), data, user_sockets);
    });

    // Handle left event
    socket.on("left", move |socket: SocketRef, Data::<Value>(data)| {
        let app_state = app_state.clone();
        let user_sockets = user_sockets.clone();
        handle_left(socket, SocketIo::new(), data, user_sockets);
    });

    // Handle chat event
    socket.on("chat", move |socket: SocketRef, Data::<Value>(data)| {
        let app_state = app_state.clone();
        let user_sockets = user_sockets.clone();
        handle_chat(socket, SocketIo::new(), data, app_state.db, user_sockets);
    });

    // Handle writing event
    socket.on("writing", move |socket: SocketRef, Data::<Value>(data)| {
        let app_state = app_state.clone();
        handle_writing(socket, SocketIo::new(), data);
    });

    // Handle cancelWriting event
    socket.on("cancelWriting", move |socket: SocketRef, Data::<Value>(data)| {
        let app_state = app_state.clone();
        handle_cancel_writing(socket, SocketIo::new(), data);
    });

    // Keep ping for testing
    socket.on("ping", |socket: SocketRef, Data::<Value>(data)| {
        info!("Received event: {:?}", data);
        socket.emit("ping", &data).ok();
    });

    socket.on("message-with-ack", |Data::<Value>(data), ack: AckSender| {
        info!("Received event: {:?}", data);
        ack.send(&data).ok();
    });
}

#[derive(Clone)]
struct AppState {
    db: Pool<Postgres>,
}

type UserSocketMap = handlers::UserSocketMap;

#[tokio::main(flavor = "multi_thread", worker_threads = 4)]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing::subscriber::set_global_default(FmtSubscriber::default())?;

    let pool = create_connection().await;

    let state = AppState { db: pool };
    let user_sockets: UserSocketMap = Arc::new(RwLock::new(HashMap::new()));

    let (layer, io) = SocketIo::new_layer();

    let layer = ServiceBuilder::new()
        .layer(CorsLayer::permissive()) // Enable CORS policy
        .layer(layer);

    // Create a closure that captures the state and user_sockets
    let on_connect_handler = move |socket: SocketRef, Data(data): Data<Value>| {
        let state = state.clone();
        let user_sockets = user_sockets.clone();
        on_connect(socket, data, state, user_sockets);
    };

    io.ns("/", on_connect_handler);

    let app = axum::Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .merge(router::main())
        .layer(layer)
        .with_state(state);

    info!("Starting server");

    let listener = match tokio::net::TcpListener::bind("0.0.0.0:3333").await {
        Ok(listener) => listener,
        Err(e) => {
            eprintln!("Failed to bind to port 3333: {}", e);
            return Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::AddrInUse,
                format!("Failed to bind to port 3333: {}", e),
            )));
        }
    };

    if let Err(e) = axum::serve(listener, app).await {
        eprintln!("Server error: {}", e);
        return Err(Box::new(e));
    }

    Ok(())
}
