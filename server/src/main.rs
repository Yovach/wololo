use std::env;

use axum::{
    extract::DefaultBodyLimit,
    routing::{get, post},
    Router,
};
use dotenvy::dotenv;
use http::{HeaderName, HeaderValue, Method};
use tower_http::cors::CorsLayer;
pub mod errors;
pub mod formats;
pub mod routes;
pub mod tmp_file;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    // Check if `.env` file is present
    if let Ok(_) = dotenv() {
        tracing::info!("environment file found");
    }

    // Check if FRONT_ENV is defined as environment variable
    let front_url = match env::var("FRONT_URL") {
        Ok(value) => value,
        Err(_) => {
            tracing::error!("`FRONT_URL` is not set in environment");
            return;
        },
    };

    let app = Router::new()
        .route("/convert-file", post(routes::accept_form))
        .route("/available-formats", get(routes::available_formats))
        .layer(DefaultBodyLimit::max(1024 * 1024 * 1024)) // 1 GB
        .layer(
            CorsLayer::new()
                .allow_origin(front_url.parse::<HeaderValue>().unwrap())
                .allow_methods([Method::GET])
                .expose_headers([HeaderName::from_static("x-file-name")]),
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    tracing::info!("listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app).await.unwrap();
}
