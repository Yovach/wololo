use std::{fs::File, io::Write, process::Command};

use axum::{
    body::{Body, Bytes},
    extract::Multipart,
    http::header,
    response::{self, Html, IntoResponse},
    Json,
};
use http::{HeaderName, Response};
use nanoid::nanoid;
use serde::Serialize;
use tokio::fs;

use crate::{
    errors::ConvertError,
    formats::{self, SUPPORTED_FORMATS},
    tmp_file::TmpFile,
};

pub async fn root() -> Html<&'static str> {
    Html(
        r#"
        <!doctype html>
        <html>
            <head></head>
            <body>
                <form action="/" method="post" enctype="multipart/form-data">
                    <select name="format">
                        <option>webm</option>
                        <option>wmv</option>
                        <option>mkv</option>
                        <option>mp4</option>
                        <option>gif</option>
                        <option>mp3</option>
                        <option>ogg</option>
                        <option>wav</option>
                    </select>

                    <input type="file" name="file" />
                    <input type="submit" value="Send">
                </form>
            </body>
        </html>
        "#,
    )
}

#[derive(Serialize)]
pub struct AvailableFormatsResp {
    formats: &'static [&'static str],
}

pub async fn available_formats() -> Json<AvailableFormatsResp> {
    return Json(AvailableFormatsResp {
        formats: SUPPORTED_FORMATS,
    });
}

pub async fn accept_form(mut multipart: Multipart) -> Result<Response<Body>, ConvertError> {
    let mut tmp_file: Option<TmpFile> = None;
    let mut output_format: Option<String> = None;
    while let Some(field) = multipart.next_field().await.unwrap() {
        match field.name().unwrap() {
            "file" => {
                let file_name: String = field.file_name().expect("can't ").to_string();
                let content_type: String = field.content_type().unwrap().to_string();

                let bytes = field.bytes().await;
                if let Err(err) = bytes {
                    tracing::error!("an error occured while reading multipart (err: {})", err);
                    return Err(ConvertError::Parsing);
                }

                let file_id: String = nanoid!();

                let data: Bytes = bytes.unwrap();
                let folder: String = "../tmp/".to_string();
                let file_path: &str = &(folder.clone() + file_id.as_str()).to_string();

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
                        if !formats::SUPPORTED_FORMATS.contains(&value.as_str()) {
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

    let output_format: String = output_format.unwrap();
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

    let output_path: String = file_path.to_string() + ".output." + &output_format;

    if let Err(err) = Command::new("ffmpeg")
        .arg("-loglevel")
        .arg("quiet")
        .arg("-i")
        .arg(file_path)
        .arg(&output_path)
        .spawn()
        .expect("I expected a result here")
        .wait_with_output()
    {
        tracing::error!("an error occured while converting file (err: {})", err);
        return Err(ConvertError::DuringConversion);
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

    let file_name: String = file_data.to_owned().name + "." + &output_format;
    let content_disposition: String = format!("attachement; filename=\"{}\"", file_name);

    let headers = response::AppendHeaders([
        (header::CONTENT_TYPE, "application/octet-stream"),
        (header::CONTENT_DISPOSITION, content_disposition.as_str()),
        (HeaderName::from_static("x-file-name"), file_name.as_str())
    ]);

    file_data.delete();

    if let Err(err) = fs::remove_file(&output_path).await {
        tracing::error!("an error occured while removing output file : {output_path} (err: {err})");
    }

    return Ok((headers, Bytes::from(converted_file)).into_response());
}
