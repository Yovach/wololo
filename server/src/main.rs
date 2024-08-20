use axum::{
    extract::DefaultBodyLimit,
    routing::{get, post},
    Router,
};
use http::{HeaderValue, Method};
use tower_http::cors::CorsLayer;
use tracing::info;
pub mod errors;
pub mod formats;
pub mod routes;
pub mod tmp_file;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/", get(routes::root))
        .route("/", post(routes::accept_form))
        .route("/available-formats", get(routes::available_formats))
        .layer(DefaultBodyLimit::max(1024 * 1024 * 1024)) // 1 GB
        .layer(
            CorsLayer::new()
                .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
                .allow_methods([Method::GET]),
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    info!("listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app).await.unwrap();
}
