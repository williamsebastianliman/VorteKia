use tauri::{command, State};
use crate::{entities::ride_queue, handlers::ride_queue_handler, repositories::ride_queue_repository, state::AppState};

use super::assigned_ride_staff_controller;

#[command]
pub async fn get_queue_by_ride(id: String, state: State<'_, AppState>) -> Result<Vec<ride_queue::Model>, String> {
    let db = &state.db;
    ride_queue_handler::get_queue_by_ride(db, id).await
}

#[command]
pub async fn get_queue_by_staff(state: State<'_, AppState>, id: String) -> Result<Vec<ride_queue::Model>, String> {
    let db = &state.db;
    let ride_result = assigned_ride_staff_controller::get_ride_by_schedule(state.clone(), id).await;

    match ride_result {
        Ok(ride_id) => {
            if ride_id == "None" {
                Err("No Work Schedule For This Shift!".to_string())
            } else {
                ride_queue_repository::get_queue_by_ride(db, ride_id).await
            }
        }
        Err(err) => Err(err),
    }
}

#[command]
pub async fn delete_queue_by_key(ride_id: String, queue_number: i32, state: State<'_, AppState>) -> Result<String, String> {
    let db = &state.db;
    ride_queue_handler::delete_queue_by_key(db, ride_id, queue_number).await
}

#[command]
pub async fn insert_queue_by_customer(customer_id: String, ride_id: String, state: State<'_, AppState>) -> Result<String, String> {
    let db = &state.db;
    ride_queue_repository::insert_queue_by_customer(db, customer_id, ride_id).await
}

#[command]
pub async fn update_queue(ride_id: String, queue_number: i32, new_customer_id: String, state: State<'_, AppState>) -> Result<String, String> {
    let db = &state.db;
    ride_queue_repository::update_queue_customer_by_queue_number(db, ride_id, queue_number, new_customer_id).await
}
