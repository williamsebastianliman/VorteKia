use chrono::{Local, NaiveTime};
use tauri::{command, State};

use crate::{entities::restaurant, handlers::restaurant_handler, state::AppState};

use super::{assigned_chef_controller, assigned_waiter_controller};

#[command]
pub async fn get_all_restaurants(state: State<'_, AppState>) -> Result<Vec<restaurant::Model>, String> {
    let db = &state.db;
    restaurant_handler::get_all_restaurants(db).await
}

#[command]
pub async fn get_restaurant_by_id(state: State<'_, AppState>, id: String) -> Result<restaurant::Model, String> {
    let db = &state.db;
    restaurant_handler::get_restaurant_by_id(db, id).await
}

#[command]
pub async fn update_restaurant_by_id(
    state: State<'_, AppState>,
    id: String,
    name: String,
    description: String,
    image_data: Option<Vec<u8>>,
    open_time: NaiveTime,
    close_time: NaiveTime,
) -> Result<String, String> {
    let db = &state.db;
    restaurant_handler::update_restaurant_by_id(db, id, name, description, image_data, open_time, close_time).await
}

#[command]
pub async fn is_restaurant_open(state: State<'_, AppState>, id: String) -> Result<bool, String> {
    let db = &state.db;

    let restaurant = restaurant_handler::get_restaurant_by_id(db, id.clone())
        .await
        .map_err(|e| format!("Restaurant error: {}", e))?;

    let chef_count = assigned_chef_controller::count_chefs_by_restaurant_id(state.clone(), id.clone())
        .await
        .map_err(|e| format!("Chef count error: {}", e))?;

    let waiter_count = assigned_waiter_controller::count_waiter_by_restaurant_id(state.clone(), id.clone())
        .await
        .map_err(|e| format!("Waiter count error: {}", e))?;

    let now = Local::now().time();
    let is_within_time = restaurant.restaurant_open_time <= now && now <= restaurant.restaurant_close_time;
    let is_properly_staffed = chef_count >= 2 && waiter_count >= 2;

    Ok(is_within_time && is_properly_staffed)
}

#[command]
pub async fn insert_restaurant(
    state: State<'_, AppState>,
    name: String,
    description: String,
    cuisine: String,
    open_time: NaiveTime,
    close_time: NaiveTime,
    location: String
) -> Result<String, String> {
    let db = &state.db;
    restaurant_handler::insert_restaurant(db, name, description, cuisine, open_time, close_time, location).await
}

#[command]
pub async fn delete_restaurant_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<String, String> {
    let db = &state.db;
    restaurant_handler::delete_restaurant_by_id(db, id).await
}
