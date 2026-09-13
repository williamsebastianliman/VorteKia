use std::fs;
use serde::Deserialize;

#[derive(Deserialize)]
struct AppConfig {
    app_id: String,
}

#[tauri::command]
pub fn get_app_id_command() -> Result<String, String> {
    let config_path = "config/app_id.json";
    let contents = fs::read_to_string(config_path).map_err(|e| e.to_string())?;
    let config: AppConfig = serde_json::from_str(&contents).map_err(|e| e.to_string())?;
    Ok(config.app_id)
}