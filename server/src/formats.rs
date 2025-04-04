/// List of supported output file extensions for videos
pub static SUPPORTED_VIDEO_FORMATS: &[& str] = &["webm", "wmv", "mkv", "mp4", "gif"];

/// List of supported output file extensions for audios
pub static SUPPORTED_AUDIO_FORMATS: & [& str] = &["mp3", "ogg", "wav"];

/// List of supported output file extensions for images
pub static SUPPORTED_IMAGE_FORMATS: & [& str] =
    &["png", "jpeg", "avif", "webp"];

pub enum OutputFormat {
    VIDEO,
    IMAGE,
    AUDIO,
}

pub fn is_output_format_supported(output: &str) -> bool {
    self::SUPPORTED_VIDEO_FORMATS.contains(&output)
        || self::SUPPORTED_IMAGE_FORMATS.contains(&output)
        || self::SUPPORTED_AUDIO_FORMATS.contains(&output)
}
