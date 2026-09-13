use tauri::{command, State};
use crate::state::AppState;
use crate::repositories::notification_repository;
use crate::entities::notification;

#[command]
pub async fn insert_notification(
    state: State<'_, AppState>,
    customer_id: String,
    message: String,
) -> Result<String, String> {
    if customer_id.trim().is_empty() || message.trim().is_empty() {
        return Err("Customer ID and message cannot be empty.".into());
    }

    let db = &state.db;
    notification_repository::insert_notification(db, customer_id, message).await
}

#[command]
pub async fn get_all_notifications_by_customer(
    state: State<'_, AppState>,
    customer_id: String,
) -> Result<Vec<notification::Model>, String> {
    if customer_id.trim().is_empty() {
        return Err("Customer ID cannot be empty.".into());
    }

    let db = &state.db;
    notification_repository::get_all_notifications_by_customer(db, customer_id).await
}