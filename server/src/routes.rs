use std::{fs::File, io::Write, process::Command};

use axum::{extract::Multipart, response::Html};
use nanoid::nanoid;
use serde::Deserialize;

use crate::tmp_file::TmpFile;

pub async fn root() -> Html<&'static str> {
    Html(
        r#"
        <!doctype html>
        <html>
            <head></head>
            <body>
                <form action="/" method="post" enctype="multipart/form-data">
                    <select name="format">
                        <option>JPEG</option>
                        <option>PNG</option>
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

pub async fn accept_form(mut multipart: Multipart) -> &'static str {
    let mut file: Option<TmpFile> = None;
    let mut format: Option<String> = None;
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();
        println!("handling {name}");
        if let Some(file_name) = field.file_name() {
            let file_name = file_name.to_string();
            let content_type = field.content_type().unwrap().to_string();

            let bytes = field.bytes().await;
            if let Err(err) = bytes {
                println!("{:?}", err);
                return "error!";
            }

            let file_id = nanoid!();

            let data = bytes.unwrap();
            println!(
                "Length of `{name}` (`{file_name}`: `{content_type}`) is {} bytes",
                data.len()
            );

            let folder: String = "../tmp/".to_string();
            let file_path: &str = &(folder.clone() + file_id.as_str()).to_string();

            file = Some(TmpFile {
                content_type: content_type,
                name: name,
                path: file_path.to_string(),
                data: data,

            });

            // let mut file = File::create_new(file_path).expect("i can't create file");
            // let file_content = &data.to_vec();

            // if let Err(_) = file.write_all(file_content) {
            //     return "i was not able to write file";
            // }

            // let output_path: &str = &(folder.clone() + file_id.as_str() + ".avi").to_string();

            // println!("input: {:?}, output: {:?}", file_path, output_path);

            // let output = Command::new("ffmpeg")
            //     .arg("-i")
            //     .arg(file_path)
            //     .arg(output_path)
            //     .spawn()
            //     .expect("I expected a result here");

            // println!("{:?}", output);
        }
    }
    return "dkddj";
    // dbg!(multipart);
}
