use tauri::{command, State};
use chrono::{DateTime, Local, NaiveDateTime};
use crate::entities::inquries_response;
use crate::repositories::inquries_response_repository;
use crate::state::AppState;

#[command]
pub async fn insert_inquries_response(
    state: State<'_, AppState>,
    customer_id: String,
    message: String
) -> Result<String, String> {
    let db = &state.db;
    let local_dt: DateTime<Local> = Local::now();
    let naive_dt: NaiveDateTime = local_dt.naive_local();

    let new_response = inquries_response::Model {
        chat_id: 0,
        customer_id,
        message,
        timestamp: naive_dt,
    };

    inquries_response_repository::insert_response(db, new_response).await
}

#[command]
pub async fn get_all_inquries_response_by_customer(
    state: State<'_, AppState>,
    customer_id: String
) -> Result<Vec<inquries_response::Model>, String> {
    let db = &state.db;
    inquries_response_repository::get_responses_by_customer_id(db, customer_id).await
}
