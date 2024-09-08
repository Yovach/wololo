/// List of supported output file extensions for videos
pub static SUPPORTED_VIDEO_FORMATS: &'static [&'static str] =
    &["webm", "wmv", "mkv", "mp4", "gif", "mp3", "ogg", "wav"];

/// List of supported output file extensions for images
pub static SUPPORTED_IMAGE_FORMATS: &'static [&'static str] =
    &["png", "jpeg", "avif", "webp", "ico"];

pub enum OutputFormat {
    VIDEO,
    IMAGE,
}
