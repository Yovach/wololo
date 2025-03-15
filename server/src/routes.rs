use std::{fs::File, io::Write};

use axum::{
    body::{Body, Bytes},
    extract::Multipart,
    http::header,
    response::{self, IntoResponse},
    Json,
};
use http::{HeaderName, Response};
use nanoid::nanoid;
use serde::Serialize;
use tokio::fs;

use crate::{
    errors::ConvertError,
    formats::{self, SUPPORTED_AUDIO_FORMATS, SUPPORTED_IMAGE_FORMATS, SUPPORTED_VIDEO_FORMATS},
    tmp_file::TmpFile,
    utils::convert_file,
};

#[derive(Serialize)]
pub struct AvailableFormatsByMedia {
    video: &'static [&'static str],
    image: &'static [&'static str],
    audio: &'static [&'static str],
}

#[derive(Serialize)]
pub struct AvailableFormatsResp {
    formats: AvailableFormatsByMedia,
}

#[derive(Serialize)]
pub struct IndexResp {
    message: &'static str,
}

pub async fn index() -> Json<IndexResp> {
    static ALIVE_MESSAGE: &'static str = "ok";

    return Json(IndexResp {
        message: ALIVE_MESSAGE,
    })
}

pub async fn available_formats() -> Json<AvailableFormatsResp> {
    return Json(AvailableFormatsResp {
        formats: AvailableFormatsByMedia {
            image: SUPPORTED_IMAGE_FORMATS,
            video: SUPPORTED_VIDEO_FORMATS,
            audio: SUPPORTED_AUDIO_FORMATS,
        },
    });
}

pub async fn accept_form(mut multipart: Multipart) -> Result<Response<Body>, ConvertError> {
    let mut tmp_file: Option<TmpFile> = None;
    let mut output_format: Option<String> = None;
    while let Some(field) = multipart.next_field().await.unwrap() {
        match field.name().unwrap() {
            "file" => {
                let file_name: String = field.file_name().expect("expected a filename").to_string();
                let content_type: String = field.content_type().unwrap().to_string();

                let bytes = field.bytes().await;
                if let Err(err) = bytes {
                    tracing::error!("an error occured while reading multipart (err: {})", err);
                    return Err(ConvertError::Parsing);
                }

                let file_id: String = nanoid!();

                let data: Bytes = bytes.unwrap();
                if data.len() == 0 {
                    tracing::error!("can't convert an empty file");
                    return Err(ConvertError::MissingFile);
                }

                let folder: String = "../tmp/".to_string();
                let file_path: String = folder.clone() + file_id.as_str();

                tmp_file = Some(TmpFile {
                    path: file_path.to_string(),
                    name: file_name,
                    content_type,
                    data,
                });
            }
            "format" => {
                output_format = match field.text().await {
                    Ok(value) => {
                        if !formats::is_output_format_supported(&value.as_str()) {
                            return Err(ConvertError::UnsupportedFormat);
                        }

                        Some(value)
                    }
                    _ => {
                        return Err(ConvertError::UnsupportedFormat);
                    }
                }
            }
            _ => {
                // ignore the field if not handled
            }
        }
    }

    if tmp_file.is_none() {
        return Err(ConvertError::MissingFile);
    }

    if output_format.is_none() {
        return Err(ConvertError::MissingFormat);
    }

    let file_data: TmpFile = tmp_file.unwrap();
    let file_path: &String = &file_data.path;

    let mut file: File = match File::create_new(&file_path) {
        Ok(file) => file,
        Err(err) => {
            tracing::error!("an error occured while creating file (err: {})", err);
            return Err(ConvertError::FileCreation);
        }
    };

    let file_content: Vec<u8> = file_data.data.to_vec();
    if let Err(_) = file.write_all(&file_content) {
        file_data.delete();
        return Err(ConvertError::FileCreation);
    }

    let output_file_extension: String = output_format.unwrap();
    let file_name = &file_data.name;
    let file_size: &usize = &file_data.data.len();
    let output_path: String = file_path.to_string() + ".output." + &output_file_extension;

    tracing::info!("start converting {} of {} bytes", file_name, file_size);

    if let Err(err) = convert_file(file_path, &output_path, &output_file_extension) {
        tracing::error!(
            "an error occured while reading converted file (err: {})",
            err
        );
        return Err(err);
    }

    let converted_file: Vec<u8> = match fs::read(&output_path).await {
        Ok(file) => file,
        Err(err) => {
            file_data.delete();
            tracing::error!(
                "an error occured while reading converted file (err: {})",
                err
            );
            return Err(ConvertError::DuringConversion);
        }
    };

    tracing::info!(
        "finished to convert {} to {}",
        file_name,
        output_file_extension
    );

    let file_name: String = file_data.to_owned().name + "." + &output_file_extension;
    let content_disposition: String = format!("attachement; filename=\"{}\"", file_name);

    let headers = response::AppendHeaders([
        (header::CONTENT_TYPE, "application/octet-stream"),
        (header::CONTENT_DISPOSITION, content_disposition.as_str()),
        (HeaderName::from_static("x-file-name"), file_name.as_str()),
    ]);

    file_data.delete();

    if let Err(err) = fs::remove_file(&output_path).await {
        tracing::error!("an error occured while removing output file : {output_path} (err: {err})");
    }

    return Ok((headers, Bytes::from(converted_file)).into_response());
}
