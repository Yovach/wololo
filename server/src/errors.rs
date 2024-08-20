use axum::{response::{IntoResponse, Response}, Json};
use http::StatusCode;
use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ConvertError {
    #[error("An error occured while parsing your request")]
    Parsing,

    #[error("This format is not supported")]
    UnsupportedFormat,

    #[error("A file to convert is required")]
    MissingFile,

    #[error("A format is required to convert the file")]
    MissingFormat,

    #[error("An error occured while writing the file")]
    FileCreation,

    #[error("An error occured during conversion")]
    DuringConversion,
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

impl IntoResponse for ConvertError {
    fn into_response(self) -> Response {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ErrorResponse {
                error: format!("Something went wrong: {}", self),
            }),
        )
            .into_response()
    }
}
