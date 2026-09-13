use chrono::{DateTime, Local, NaiveDateTime};
use crate::repositories::customer_inquiries_repository;
use crate::entities::{customer, customer_inquiries};
use crate::state::AppState;
use tauri::{command, State};

#[command]
pub async fn insert_customer_inquiries(
    state: State<'_, AppState>,
    sender_customer_id: String,
    message: String
) -> Result<String, String> {
    let db = &state.db;
    let local_dt: DateTime<Local> = Local::now();
    let naive_dt: NaiveDateTime = local_dt.naive_local();

    let new_customer_inquiries = customer_inquiries::Model {
        chat_id: 0,
        sender_customer_id,
        message,
        timestamp: naive_dt,
    };

    customer_inquiries_repository::insert_inquiries(db, new_customer_inquiries).await
}

#[command]
pub async fn get_all_customer_inquiries_by_group(
    state: State<'_, AppState>,
    group_id: String
) -> Result<Vec<customer_inquiries::Model>, String> {
    let db = &state.db;
    customer_inquiries_repository::get_inquiries_by_group_id(db, group_id).await
}

#[command]
pub async fn get_all_customers_inquired(
    state: State<'_, AppState>
) -> Result<Vec<customer::Model>, String> {
    let db = &state.db;
    customer_inquiries_repository::get_all_customers_inquired(db).await
}
