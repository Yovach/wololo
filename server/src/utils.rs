use std::process::Command;

use crate::{
    errors::ConvertError,
    formats::{
        OutputFormat, SUPPORTED_AUDIO_FORMATS, SUPPORTED_IMAGE_FORMATS, SUPPORTED_VIDEO_FORMATS,
    },
};

fn detect_file_type(file_path: &str) -> Result<OutputFormat, ()> {
    let is_image = SUPPORTED_IMAGE_FORMATS
        .iter()
        .any(|ext| file_path.ends_with(ext.to_owned()));
    if is_image {
        return Ok(OutputFormat::IMAGE);
    }

    let is_video = SUPPORTED_VIDEO_FORMATS
        .iter()
        .any(|ext| file_path.ends_with(ext.to_owned()));
    if is_video {
        return Ok(OutputFormat::VIDEO);
    }

    let is_audio = SUPPORTED_AUDIO_FORMATS
        .iter()
        .any(|ext| file_path.ends_with(ext.to_owned()));
    if is_audio {
        return Ok(OutputFormat::AUDIO);
    }

    return Err(());
}

pub fn convert_file(
    file_path: &str,
    output_path: &str,
    output_file_extension: &str,
) -> Result<(), ConvertError> {
    if let Ok(output_format) = detect_file_type(output_path) {
        match output_format {
            OutputFormat::IMAGE => {
                if let Err(err) = Command::new("vips")
                    .arg(format!("{output_file_extension}save"))
                    .arg(file_path)
                    .arg(output_path)
                    .spawn()
                    .expect("I expected a result here")
                    .wait_with_output()
                {
                    tracing::error!("an error occured while converting file (err: {})", err);
                    return Err(ConvertError::DuringConversion);
                }
            }
            OutputFormat::VIDEO | OutputFormat::AUDIO => {
                if let Err(err) = Command::new("ffmpeg")
                    .arg("-loglevel")
                    .arg("quiet")
                    .arg("-i")
                    .arg(file_path)
                    .arg(output_path)
                    .spawn()
                    .expect("I expected a result here")
                    .wait_with_output()
                {
                    tracing::error!("an error occured while converting file (err: {})", err);
                    return Err(ConvertError::DuringConversion);
                }
            }
        }
    }

    return Ok(());
}
