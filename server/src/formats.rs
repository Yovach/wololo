pub enum SupportedFormat {
    // VIDEO
    AV1,
    MOV,
    MP4,
    WEBM,
    GIF,

    // AUDIO
    MP3,
    OGG,
    WAV,
}

impl SupportedFormat {
    pub fn from_value(value: String) -> Result<SupportedFormat, &'static str> {
        return match value.as_str() {
            "av1" => Ok(SupportedFormat::AV1),
            "mov" => Ok(SupportedFormat::MOV),
            "mp4" => Ok(SupportedFormat::MP4),
            "webm" => Ok(SupportedFormat::WEBM),
            "mp3" => Ok(SupportedFormat::MP3),
            "ogg" => Ok(SupportedFormat::OGG),
            "wav" => Ok(SupportedFormat::WAV),
            "gif" => Ok(SupportedFormat::GIF),
            _ => Err("invalid format"),
        };
    }

    pub fn to_str(&self) -> &'static str {
        match self {
            SupportedFormat::AV1 => "av1",
            SupportedFormat::MOV => "mov",
            SupportedFormat::MP4 => "mp4",
            SupportedFormat::WEBM => "webm",
            SupportedFormat::MP3 => "mp3",
            SupportedFormat::OGG => "ogg",
            SupportedFormat::WAV => "wav",
            SupportedFormat::GIF => "gif",
        }
    }
}
