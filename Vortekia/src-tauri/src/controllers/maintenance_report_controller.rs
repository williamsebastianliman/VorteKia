use crate::{
    entities::maintenance_report,
    handlers::maintenance_report_handler,
    repositories::maintenance_task_repository::get_maintenance_task_by_id,
    state::AppState,
};
use tauri::{command, State};

use super::maintenance_task_controller;

#[command]
pub async fn insert_new_maintenance_report(
    state: State<'_, AppState>,
    id: String,
    staff_id: String,
    description: String,
) -> Result<String, String> {
    if id.trim().is_empty() || staff_id.trim().is_empty() || description.trim().is_empty() {
        return Err("All fields must be filled!".to_string());
    }

    if description.len() < 20 {
        return Err("Description must be at least 20 characters.".to_string());
    }

    let db = &state.db;

    let task = match get_maintenance_task_by_id(db, id.clone()).await {
        Ok(task) => task,
        Err(err) => return Err(err),
    };

    let report_status = if task.status == "Finished" {
        "Uncompleted"
    } else {
        "Waiting"
    }
    .to_string();

    maintenance_report_handler::insert_maintenance_report(db, id, staff_id, description, report_status).await
}

#[command]
pub async fn get_all_maintenance_report_by_staff(
    state: State<'_, AppState>,
    staff_id: String,
) -> Result<Vec<maintenance_report::Model>, String> {
    let db = &state.db;

    let mut reports = match maintenance_report_handler::get_all_maintenance_report_by_staff(db, staff_id.clone()).await {
        Ok(data) => data,
        Err(err) => return Err(err),
    };

    for report in &mut reports {
        if let Ok(task) = maintenance_task_controller::get_maintenance_task_by_id(state.clone(), report.task_id.clone()).await {
            if task.status == "Finished" && report.report_status == "Waiting" {
                let _ = update_maintenance_report_status_by_id(state.clone(), report.task_id.clone(), "Uncompleted".to_string()).await;
                report.report_status = "Uncompleted".to_string();
            }
        }
    }

    Ok(reports)
}

#[command]
pub async fn is_staff_inactive_report(
    state: State<'_, AppState>,
    staff_id: String,
) -> Result<String, String> {
    let db = &state.db;
    maintenance_report_handler::is_staff_inactive(db, staff_id).await
}

#[command]
pub async fn update_maintenance_report_by_id(
    state: State<'_, AppState>,
    id: String,
    description: String,
    image_data: Option<Vec<u8>>,
    status: String,
) -> Result<String, String> {
    if description.len() < 20 {
        return Err("Description Must Be At Least 20 Characters!".to_string());
    }

    let db = &state.db;
    maintenance_report_handler::update_maintenance_report_by_id(db, id, description, image_data, status).await
}

#[command]
pub async fn get_all_maintenance_report(state: State<'_, AppState>) -> Result<Vec<maintenance_report::Model>, String> {
    let db = &state.db;
    maintenance_report_handler::get_all_maintenance_report(db).await
}

#[command]
pub async fn update_maintenance_report_status_by_id(
    state: State<'_, AppState>,
    id: String,
    status: String,
) -> Result<String, String> {
    let db = &state.db;
    maintenance_report_handler::update_maintenance_report_status_by_id(db, id, status).await
}

#[command]
pub async fn get_maintenance_report_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<maintenance_report::Model, String> {
    let db = &state.db;
    maintenance_report_handler::get_maintenance_report_by_id(db, id).await
}
