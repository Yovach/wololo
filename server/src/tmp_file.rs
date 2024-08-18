use axum::body::Bytes;

#[derive(Clone, Debug)]
pub struct TmpFile {
    pub name: String,
    pub path: String,
    pub data: Bytes,

    pub content_type: String,
}
