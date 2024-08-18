pub enum SupportedFormat {
    // VIDEO
    WEBM,
    WMV,
    MKV,
    MP4,
    GIF,

    // AUDIO
    MP3,
    OGG,
    WAV,
}

impl SupportedFormat {
    pub fn from_value(value: String) -> Result<SupportedFormat, &'static str> {
        return match value.as_str() {
            "webm" => Ok(SupportedFormat::WEBM),
            "wmv" => Ok(SupportedFormat::WMV),
            "mkv" => Ok(SupportedFormat::MKV),
            "mp4" => Ok(SupportedFormat::MP4),
            "gif" => Ok(SupportedFormat::GIF),
            "mp3" => Ok(SupportedFormat::MP3),
            "ogg" => Ok(SupportedFormat::OGG),
            "wav" => Ok(SupportedFormat::WAV),
            _ => Err("invalid format"),
        };
    }

    pub fn to_str(&self) -> &'static str {
        match self {
            SupportedFormat::WEBM => "webm",
            SupportedFormat::WMV => "wmv",
            SupportedFormat::MKV => "mkv",
            SupportedFormat::MP4 => "mp4",
            SupportedFormat::GIF => "gif",
            SupportedFormat::MP3 => "mp3",
            SupportedFormat::OGG => "ogg",
            SupportedFormat::WAV => "wav",
        }
    }
}
