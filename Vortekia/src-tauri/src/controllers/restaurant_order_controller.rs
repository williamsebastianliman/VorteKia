use crate::{entities::restaurant_order, repositories::restaurant_order_repository, state::AppState};
use tauri::{command, State};

#[command]
pub async fn insert_order_by_customer(state: State<'_, AppState>, transaction_id: String) -> Result<String, String> {
    let db = &state.db;
    restaurant_order_repository::insert_order_by_customer(db, transaction_id).await
}

#[command]
pub async fn update_order_status_and_staff(
    state: State<'_, AppState>,
    order_id: i32,
    new_status: String,
    staff_id: Option<String>,
) -> Result<String, String> {
    let db = &state.db;
    restaurant_order_repository::update_order_status_and_staff(db, order_id, &new_status, staff_id).await
}

#[command]
pub async fn update_order_status(
    state: State<'_, AppState>,
    order_id: i32,
    new_status: String,
) -> Result<String, String> {
    let db = &state.db;
    restaurant_order_repository::update_order_status(db, order_id, &new_status).await
}

#[command]
pub async fn get_order_by_transaction_id(
    state: State<'_, AppState>,
    transaction_id: String,
) -> Result<Option<restaurant_order::Model>, String> {
    let db = &state.db;
    restaurant_order_repository::get_order_by_transaction_id(db, transaction_id).await
}

#[command]
pub async fn get_orders_by_restaurant_and_status(
    state: State<'_, AppState>,
    restaurant_id: String,
    status: String,
) -> Result<Vec<restaurant_order::Model>, String> {
    let db = &state.db;
    restaurant_order_repository::get_orders_by_restaurant_and_status(db, restaurant_id, status).await
}

#[command]
pub async fn get_orders_by_restaurant_staff_status(
    state: State<'_, AppState>,
    restaurant_id: String,
    staff_id: String,
    status: String,
) -> Result<Vec<restaurant_order::Model>, String> {
    let db = &state.db;
    restaurant_order_repository::get_orders_by_restaurant_staff_status(db, restaurant_id, staff_id, status).await
}
