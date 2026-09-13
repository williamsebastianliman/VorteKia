use chrono::{NaiveTime, Timelike};
use tauri::{command, State};
use crate::{entities::ride, handlers::{assigned_ride_staff_handler, ride_handler}, repositories::maintenance_task_repository, state::AppState};

#[command]
pub async fn get_all_rides(state: State<'_, AppState>) -> Result<Vec<ride::Model>, String> {
    let db = &state.db;
    ride_handler::get_all_rides(db).await
}

#[command]
pub async fn get_ride_by_id(id: String, state: State<'_, AppState>) -> Result<ride::Model, String> {
    let db = &state.db;
    ride_handler::get_ride_by_id(db, id).await
}

#[command]
pub async fn update_ride_by_id(
    id: String,
    name: String,
    description: String,
    image_data: Option<Vec<u8>>,
    open_time: NaiveTime,
    close_time: NaiveTime,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let db = &state.db;
    ride_handler::update_ride_by_id(db, id, name, description, image_data, open_time, close_time).await
}

#[command]
pub async fn is_ride_open(id: String, state: State<'_, AppState>) -> Result<bool, String> {
    let db = &state.db;

    let ride = ride_handler::get_ride_by_id(db, id.clone())
        .await
        .map_err(|e| format!("Ride error: {}", e))?;

    let now = chrono::Local::now().time();
    let is_within_time = ride.ride_open_time <= now && now <= ride.ride_close_time;
    if !is_within_time {
        return Ok(false);
    }

    let maintenance_free = maintenance_task_repository::is_ride_not_under_maintenance(db, id.clone())
        .await
        .map_err(|e| format!("Maintenance check error: {}", e))?;
    if !maintenance_free {
        return Ok(false);
    }

    let schedule_vec = assigned_ride_staff_handler::load_schedule_by_ride(db, id.clone())
        .await
        .map_err(|e| format!("Schedule load error: {}", e))?;

    let current_shift = match now.hour() {
        0..=8 => Some(1),
        9..=10 => Some(2),
        11..=12 => Some(3),
        13..=14 => Some(4),
        15..=16 => Some(5),
        17..=23 => Some(6),
        _ => None,
    };

    if let Some(index) = current_shift {
        let idx = index - 1;
        match schedule_vec.get(idx) {
            Some(Some(staff_model)) if !staff_model.staff_id.is_empty() => Ok(true),
            _ => Ok(false),
        }
    } else {
        Ok(false)
    }
}

#[command]
pub async fn insert_ride(
    state: State<'_, AppState>,
    name: String,
    description: String,
    price: String,
    open_time: NaiveTime,
    close_time: NaiveTime,
) -> Result<String, String> {
    let db = &state.db;
    ride_handler::insert_ride(db, name, description, price, open_time, close_time).await
}

#[command]
pub async fn delete_ride_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<String, String> {
    let db = &state.db;
    ride_handler::delete_ride_by_id(db, id).await
}
