use axum::{
    extract::DefaultBodyLimit,
    routing::{get, post},
    Router,
};
use tracing::info;
pub mod routes;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/", get(routes::root))
        .route("/", post(routes::accept_form))
        .route("/convert_video", get(routes::convert_video))
        .layer(DefaultBodyLimit::max(1025));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    info!("listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app).await.unwrap();
}
