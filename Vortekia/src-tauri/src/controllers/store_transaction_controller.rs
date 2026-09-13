use tauri::{command, State};

use crate::{
    entities::{souvenir, store_transaction_detail}, handlers::store_transaction_handler, modules::store_transaction::StoreTransaction, repositories::store_transaction_detail_repository, state::AppState
};

#[command]
pub async fn insert_new_transaction_store(
    state: State<'_, AppState>,
    souvenirs: Vec<souvenir::Model>,
    quantity: Vec<i32>,
    customer_id: String,
    store_id: String,
) -> Result<String, String> {
    let db = &state.db;
    store_transaction_handler::insert_transaction(db, souvenirs, quantity, customer_id, store_id).await
}

#[command]
pub async fn get_store_transactions_with_details(
    state: State<'_, AppState>,
    store_id: String,
) -> Result<Vec<StoreTransaction>, String> {
    let db = &state.db;
    store_transaction_handler::get_store_transactions_with_details(db, store_id).await
}

#[command]
pub async fn get_store_transaction_detail_by_header(
    state: State<'_, AppState>,
    id: i32,
) -> Result<Vec<store_transaction_detail::Model>, String> {
    let db = &state.db;
    store_transaction_detail_repository::get_store_transaction_detail_by_header(db, id).await
}
