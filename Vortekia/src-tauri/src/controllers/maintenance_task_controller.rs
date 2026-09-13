use crate::{entities::maintenance_task, handlers::maintenance_task_handler, repositories::maintenance_task_repository, state::AppState};
use chrono::NaiveDateTime;
use tauri::{command, State};

#[command]
pub async fn insert_new_maintenance_task(
    state: State<'_, AppState>,
    name: String,
    description: String,
    ride_id: String,
    staff_id: String,
    time: String,
) -> Result<String, String> {
    if name.trim().is_empty() || description.trim().is_empty() || ride_id.trim().is_empty() || staff_id.trim().is_empty() || time.trim().is_empty() {
        return Err("All Field Must Be Filled!".to_string());
    }

    let parsed_time = NaiveDateTime::parse_from_str(&time, "%Y-%m-%dT%H:%M")
        .map_err(|e| format!("Invalid date format: {}", e))?;

    if description.len() < 20 {
        return Err("Description Must Be Atleast 20 Characters".to_string());
    }

    let db = &state.db;
    maintenance_task_handler::insert_maintenance_task(db, name, description, ride_id, staff_id, parsed_time).await
}

#[command]
pub async fn get_all_maintenance_task_by_staff(
    state: State<'_, AppState>,
    staff_id: String,
) -> Result<Vec<maintenance_task::Model>, String> {
    let db = &state.db;
    maintenance_task_handler::get_all_maintenance_task_by_staff(db, staff_id).await
}

#[command]
pub async fn is_staff_inactive(
    state: State<'_, AppState>,
    staff_id: String,
) -> Result<String, String> {
    let db = &state.db;
    maintenance_task_handler::is_staff_inactive(db, staff_id).await
}

#[command]
pub async fn update_maintenance_task_by_id(
    state: State<'_, AppState>,
    id: String,
    name: String,
    description: String,
    ride_id: String,
    staff_id: String,
    time: String,
    status: String,
) -> Result<String, String> {
    let parsed_time = NaiveDateTime::parse_from_str(&time, "%Y-%m-%dT%H:%M")
        .map_err(|e| format!("Invalid date format: {}", e))?;

    let db = &state.db;
    maintenance_task_handler::update_maintenance_task_by_id(db, id, name, description, ride_id, staff_id, parsed_time, status).await
}

#[command]
pub async fn get_all_maintenance_task(
    state: State<'_, AppState>,
) -> Result<Vec<maintenance_task::Model>, String> {
    let db = &state.db;
    maintenance_task_handler::get_all_maintenance_task(db).await
}

#[command]
pub async fn get_maintenance_task_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<maintenance_task::Model, String> {
    let db = &state.db;
    maintenance_task_handler::get_maintenance_task_by_id(db, id).await
}

#[command]
pub async fn delete_maintenance_task_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<String, String> {
    let db = &state.db;
    maintenance_task_handler::delete_maintenance_task_by_id(db, id).await
}

#[command]
pub async fn update_maintenance_task_status_by_id(
    state: State<'_, AppState>,
    id: String,
    status: String,
) -> Result<String, String> {
    let db = &state.db;
    maintenance_task_handler::update_maintenance_task_status_by_id(db, id, status).await
}

#[command]
pub async fn is_ride_not_under_maintenance(state: State<'_, AppState>,ride_id: String) -> Result<bool, String> 
{
    let db = &state.db;
    maintenance_task_repository::is_ride_not_under_maintenance(db, ride_id).await
}
