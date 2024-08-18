use axum::body::Bytes;

pub struct TmpFile {
    pub name: String,
    pub path: String,
    pub data: Bytes,

    pub content_type: String,
}

impl TmpFile {
    fn save(&self) {

    }
}
