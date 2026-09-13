use chrono::{Local, NaiveTime};
use tauri::{command, State};

use crate::{
    entities::store,
    handlers::store_handler,
    repositories::store_repository,
    state::AppState,
};

#[command]
pub async fn get_all_stores(state: State<'_, AppState>) -> Result<Vec<store::Model>, String> {
    let db = &state.db;
    store_handler::get_all_stores(db).await
}

#[command]
pub async fn get_store_by_id(state: State<'_, AppState>, id: String) -> Result<store::Model, String> {
    let db = &state.db;
    store_handler::get_store_by_id(db, id).await
}

#[command]
pub async fn update_store_by_id(
    state: State<'_, AppState>,
    id: String,
    name: String,
    description: String,
    image_data: Option<Vec<u8>>,
    open_time: NaiveTime,
    close_time: NaiveTime,
) -> Result<String, String> {
    let db = &state.db;
    store_handler::update_store_by_id(db, id, name, description, image_data, open_time, close_time).await
}

#[command]
pub async fn assign_sales_associate(
    state: State<'_, AppState>,
    store_id: String,
    staff_id: String,
) -> Result<String, String> {
    let db = &state.db;
    store_repository::assign_sales_associate(db, store_id, staff_id).await
}

#[command]
pub async fn get_store_by_staff_id(
    state: State<'_, AppState>,
    staff_id: String,
) -> Result<store::Model, String> {
    let db = &state.db;
    store_repository::get_store_by_staff_id(db, staff_id).await
}

#[command]
pub async fn is_store_open(state: State<'_, AppState>, id: String) -> Result<bool, String> {
    let db = &state.db;
    let store = store_handler::get_store_by_id(db, id.clone())
        .await
        .map_err(|e| format!("Store error: {}", e))?;

    if store.staff_id.is_none() {
        return Ok(false);
    }

    let now = Local::now().time();
    let is_within_time = store.store_open_time <= now && now <= store.store_close_time;
    Ok(is_within_time)
}

#[command]
pub async fn insert_store(
    state: State<'_, AppState>,
    name: String,
    description: String,
    location: String,
    open_time: NaiveTime,
    close_time: NaiveTime,
) -> Result<String, String> {
    let db = &state.db;
    store_handler::insert_store(db, name, description, location, open_time, close_time).await
}

#[command]
pub async fn delete_store_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<String, String> {
    let db = &state.db;
    store_handler::delete_store_by_id(db, id).await
}