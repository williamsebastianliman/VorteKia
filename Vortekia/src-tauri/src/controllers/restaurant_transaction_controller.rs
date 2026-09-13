use crate::{entities::{menu, restaurant_transaction_detail}, handlers::restaurant_transaction_handler, repositories::restaurant_transaction_detail_repository, state::AppState};
use tauri::{command, State};

#[command]
pub async fn insert_new_transaction(
    state: State<'_, AppState>,
    menus: Vec<menu::Model>,
    quantity: Vec<i32>,
    customer_id: String,
    restaurant_id: String,
) -> Result<String, String> {
    if menus.is_empty() {
        return Err("Choose At least One Food!".to_string());
    }

    let db = &state.db;
    restaurant_transaction_handler::insert_transaction(db, menus, quantity, customer_id, restaurant_id).await
}

#[command]
pub async fn get_restaurant_transaction_detail_by_header(
    state: State<'_, AppState>,
    id: String,
) -> Result<Vec<restaurant_transaction_detail::Model>, String> {
    let db = &state.db;
    restaurant_transaction_detail_repository::get_restaurant_transaction_detail_by_header(db, id).await
}
