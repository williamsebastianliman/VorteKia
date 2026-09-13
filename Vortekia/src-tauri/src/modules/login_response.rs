#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct LoginResponse {
    pub message: String,
    pub redirect_url: String,
}
