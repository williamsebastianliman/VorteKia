use crate::handlers::assigned_ride_staff_handler;
use crate::state::AppState;
use tauri::{command, State};

#[command]
pub async fn insert_ride_schedule(
    state: State<'_, AppState>,
    staffs: Vec<Option<String>>,
    ride_id: String,
) -> Result<String, String> {
    let db = &state.db;
    assigned_ride_staff_handler::insert_schedule(db, staffs, ride_id).await
}

#[command]
pub async fn get_assigned_staff_by_ride(
    state: State<'_, AppState>,
    id: String,
) -> Result<Vec<Option<String>>, String> {
    let db = &state.db;
    match assigned_ride_staff_handler::load_schedule_by_ride(db, id).await {
        Ok(schedule) => {
            let staff_id: Vec<Option<String>> = schedule
                .into_iter()
                .map(|entry| entry.map(|model| model.staff_id.clone()))
                .collect();
            Ok(staff_id)
        }
        Err(err) => Err(err),
    }
}

#[command]
pub async fn is_staff_available(
    state: State<'_, AppState>,
    id: String,
    shift: i32,
) -> Result<String, String> {
    let db = &state.db;
    assigned_ride_staff_handler::is_staff_available(db, id, shift).await
}

#[command]
pub async fn get_ride_by_schedule(
    state: State<'_, AppState>,
    id: String,
) -> Result<String, String> {
    let db = &state.db;
    assigned_ride_staff_handler::get_ride_by_schedule(db, id).await
}
