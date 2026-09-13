use crate::{handlers::auth_handler, modules::login_response::LoginResponse, state::AppState};
use tauri::{command, State};

#[command]
pub async fn customer_login(state: State<'_, AppState>, id: String) -> Result<String, String> {
    if id.trim().is_empty() {
        return Err("All Field Must Be Filled!".to_string());
    }
    auth_handler::customer_login(id, state).await
}

#[command]
pub async fn check_customer_login(state: State<'_, AppState>) -> Result<bool, String> {
    let sessions = state.sessions.lock().unwrap();
    Ok(sessions.contains_key("customer_id"))
}

#[command]
pub async fn check_staff_login(state: State<'_, AppState>) -> Result<bool, String> {
    let sessions = state.sessions.lock().unwrap();
    Ok(sessions.contains_key("staff_id"))
}

#[command]
pub fn customer_logout(state: State<'_, AppState>) -> Result<String, String> {
    let mut sessions = state.sessions.lock().map_err(|_| "Failed to access session storage".to_string())?;
    if sessions.remove("customer_id").is_some() {
        Ok("Successfully logged out".to_string())
    } else {
        Err("No active session found".to_string())
    }
}

#[command]
pub fn get_logged_in_customer(state: State<'_, AppState>) -> Result<String, String> {
    let sessions = state.sessions.lock().map_err(|_| "Failed to access session storage".to_string())?;
    if let Some(customer_id) = sessions.get("customer_id") {
        Ok(customer_id.clone())
    } else {
        Err("No customer is currently logged in".to_string())
    }
}

#[command]
pub fn get_logged_in_staff(state: State<'_, AppState>) -> Result<String, String> {
    let sessions = state.sessions.lock().map_err(|_| "Failed to access session storage".to_string())?;
    if let Some(staff_id) = sessions.get("staff_id") {
        Ok(staff_id.clone())
    } else {
        Err("No staff is currently logged in".to_string())
    }
}

#[command]
pub async fn staff_login(
    id: String,
    password: String,
    state: State<'_, AppState>,
) -> Result<LoginResponse, String> {
    if id.trim().is_empty() || password.trim().is_empty() {
        return Err("All fields must be filled.".to_string());
    }

    auth_handler::staff_login(id, password, state).await
}
