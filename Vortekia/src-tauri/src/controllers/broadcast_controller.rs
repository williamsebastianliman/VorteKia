use chrono::{DateTime, Local, NaiveDateTime};
use crate::{entities::broadcast, repositories::broadcast_repository, state::AppState};
use tauri::{command, State};

#[command]
pub async fn insert_broadcast(
    state: State<'_, AppState>,
    broadcast_type: String,
    broadcast_message: String,
) -> Result<String, String> {
    let db = &state.db;
    let local_dt: DateTime<Local> = Local::now();
    let naive_dt: NaiveDateTime = local_dt.naive_local();

    let new_broadcast = broadcast::Model {
        broadcast_id: 0,
        broadcast_type,
        broadcast_message,
        timestamp: naive_dt,
    };

    broadcast_repository::insert_broadcast(db, new_broadcast).await
}

#[command]
pub async fn get_all_broadcast_by_type(
    state: State<'_, AppState>,
    b_type: String,
) -> Result<Vec<broadcast::Model>, String> {
    let db = &state.db;
    broadcast_repository::get_all_broadcasts_by_type(db, b_type).await
}
