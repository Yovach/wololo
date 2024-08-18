use std::{fs::File, io::Write, process::Command};

use axum::{
    body::{Body, Bytes},
    extract::Multipart,
    http::header,
    response::{self, Html, IntoResponse},
};
use http::Response;
use nanoid::nanoid;
use serde::Deserialize;
use tokio::fs;

use crate::{formats::SupportedFormat, tmp_file::TmpFile};

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
                    <input type="submit" value="Subscribe!">

                </form>
            </body>
        </html>
        "#,
    )
}

pub async fn convert_video() -> &'static str {
    "hello convert video bro!"
}

#[derive(Deserialize, Debug)]
#[allow(dead_code)]
pub struct Input {
    name: String,
    email: String,
}

pub async fn accept_form(mut multipart: Multipart) -> Response<Body> {
    let mut tmp_file: Option<TmpFile> = None;
    let mut output_format: Option<SupportedFormat> = None;
    while let Some(field) = multipart.next_field().await.unwrap() {
        let field_name = field.name().unwrap();
        match field_name {
            "file" => {
                let file_name = field.file_name().expect("can't ").to_string();
                let content_type = field.content_type().unwrap().to_string();

                let bytes = field.bytes().await;
                if let Err(err) = bytes {
                    println!("{:?}", err);
                    return "error!".into_response();
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
                    if let Ok(supported_format) = SupportedFormat::from_value(value) {
                        output_format = Some(supported_format)
                    } else {
                        return "invalid format".into_response();
                    }
                }
            }
            _ => {
                println!("{:?} is not covered!", field_name);
            }
        }
    }

    if tmp_file.is_none() {
        return "invalid file".into_response();
    }

    if output_format.is_none() {
        return "invalid format".into_response();
    }

    let output_format = &output_format.unwrap();

    let file_data = tmp_file.unwrap();

    let file_path = &file_data.path;

    let mut file = File::create_new(file_path).expect("i can't create file");
    let file_content = file_data.data.to_vec();
    if let Err(_) = file.write_all(&file_content) {
        return "i was not able to write file".into_response();
    }

    let mut output_path = file_path.to_string();
    output_path.push_str(".output");

    let output_path = file_data.path.to_string() + ".output." + output_format.to_str();
    println!("input: {:?}, output: {:?}", file_data.path, &output_path);

    let output = Command::new("ffmpeg")
        .arg("-i")
        .arg(file_data.path)
        .arg(&output_path)
        .spawn()
        .expect("I expected a result here")
        .wait_with_output();

    let converted_file = fs::read(output_path).await.expect("can't read output file");

    let file_name = file_data.name + "." + output_format.to_str();
    let content_disposition = &format!("attachement; filename=\"{}\"", file_name);

    let headers = response::AppendHeaders([
        (header::CONTENT_TYPE, "application/octet-stream"),
        (header::CONTENT_DISPOSITION, content_disposition.as_str()),
    ]);

    return (headers, Bytes::from(converted_file)).into_response();
}
