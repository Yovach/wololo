use std::{fs::File, io::Write, process::Command};

use axum::{
    body::{Body, Bytes},
    extract::Multipart,
    http::header,
    response::{self, Html, IntoResponse},
    Json,
};
use http::Response;
use nanoid::nanoid;
use serde::Serialize;
use tokio::fs;

use crate::{
    errors::ConvertError, formats::{self, SUPPORTED_FORMATS}, tmp_file::TmpFile
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
    formats: &'static[&'static str],
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
        let field_name = field.name().unwrap();
        match field_name {
            "file" => {
                let file_name = field.file_name().expect("can't ").to_string();
                let content_type = field.content_type().unwrap().to_string();

                let bytes = field.bytes().await;
                if let Err(err) = bytes {
                    println!("{:?}", err);
                    return Err(ConvertError::Parsing)
                }

                let file_id = nanoid!();

                let data = bytes.unwrap();
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
                let text = field.text().await;
                if let Ok(value) = text {
                    if !formats::SUPPORTED_FORMATS.contains(&value.as_str()) {
                        return Err(ConvertError::UnsupportedFormat);
                    }

                    output_format = Some(value);
                }
            }
            _ => {
                // ignore the field if not handled
            }
        }
    }

    if tmp_file.is_none() {
        return Err(ConvertError::MissingFile)
    }

    if output_format.is_none() {
        return Err(ConvertError::MissingFormat)
    }

    let output_format = &output_format.unwrap();

    let file_data = tmp_file.unwrap();

    let file_path = &file_data.path;

    let mut file = File::create_new(file_path).expect("i can't create file");
    let file_content = file_data.data.to_vec();
    if let Err(_) = file.write_all(&file_content) {
        return Err(ConvertError::FileCreation)
    }

    let output_path = file_path.to_string() + ".output." + &output_format;

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
        return Err(ConvertError::DuringConversion)
    }

    let converted_file = fs::read(&output_path)
        .await
        .expect("can't read output file");

    let file_name = file_data.name + "." + output_format;
    let content_disposition = &format!("attachement; filename=\"{}\"", file_name);

    let headers = response::AppendHeaders([
        (header::CONTENT_TYPE, "application/octet-stream"),
        (header::CONTENT_DISPOSITION, content_disposition.as_str()),
    ]);

    if let Err(err) = fs::remove_file(&file_path).await {
        tracing::error!("an error occured while removing input file : {file_path} (err: {err})");
    }

    if let Err(err) = fs::remove_file(&output_path).await {
        tracing::error!("an error occured while removing output file : {output_path} (err: {err})");
    }

    return Ok((headers, Bytes::from(converted_file)).into_response());
}
