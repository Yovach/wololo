use std::fs;

use axum::body::Bytes;

#[derive(Clone, Debug)]
pub struct TmpFile {
    pub name: String,
    pub path: String,
    pub data: Bytes,

    pub content_type: String,
}

impl TmpFile {
    /// Delete the file from fs
    pub fn delete(&self) {
        if let Err(err) = fs::remove_file(&self.path) {
            tracing::error!(
                "an error occured while removing input file : {} (err: {err})",
                &self.path
            );
        }
    }
}
