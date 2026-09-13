use crate::{entities::staff, handlers::staff_handler};
use tauri::{command, State};
use crate::state::AppState;

#[command]
pub async fn register_new_staff(
    state: State<'_, AppState>,
    name: String,
    password: String,
    email: String,
    role: String,
) -> Result<String, String> {
    if name.trim().is_empty() || password.trim().is_empty() || email.trim().is_empty() || role.trim().is_empty() {
        return Err("All fields must be filled!".to_string());
    } else if !(name.len() >= 3 && name.len() <= 20) {
        return Err("Name must be between 3-20 characters".to_string());
    } else if password.len() < 8 {
        return Err("Password must be at least 8 characters".to_string());
    } else if !email.contains("@") {
        return Err("Email must contain @".to_string());
    } else if !(role == "CS" || role == "COO" || role == "RS" || role == "MS" ||
                role == "MM" || role == "RM" || role == "RDM" || role == "FNBM" ||
                role == "CF" || role == "WT" || role == "CEO" || role == "CFO" ||
                role == "LNFS" || role == "SA") {
        return Err("Role doesn't exist".to_string());
    }

    let db = &state.db;
    staff_handler::insert_staff(db, name, email, password, role).await
}

#[command]
pub async fn get_staff_by_role(
    state: State<'_, AppState>,
    role: String,
) -> Result<Vec<staff::Model>, String> {
    let db = &state.db;
    staff_handler::get_staff_by_role(db, role).await
}

#[command]
pub async fn get_staff_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<staff::Model, String> {
    let db = &state.db;
    staff_handler::get_staff_by_id(db, id).await
}
