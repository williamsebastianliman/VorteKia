use tauri::{command, State};
use crate::entities::assigned_waiter;
use crate::repositories::assigned_waiter_repository;
use sea_orm::ActiveValue::Set;
use crate::state::AppState;

#[command]
pub async fn insert_waiter_assignment(
    state: State<'_, AppState>,
    staff_id: String,
    restaurant_id: String,
    description: String,
) -> Result<String, String> {
    let db = &state.db;
    let new_assignment = assigned_waiter::Model {
        staff_id,
        restaurant_id,
        description,
    };
    assigned_waiter_repository::insert_waiter_assignment(db, new_assignment).await
}

#[command]
pub async fn update_waiter_assignment(
    state: State<'_, AppState>,
    staff_id: String,
    new_restaurant_id: String,
    description: String,
) -> Result<String, String> {
    let db = &state.db;
    match assigned_waiter_repository::get_assignment_by_staff(db, staff_id.clone()).await {
        Ok(Some(existing)) => {
            let updated = assigned_waiter::ActiveModel {
                staff_id: Set(existing.staff_id),
                restaurant_id: Set(new_restaurant_id),
                description: Set(description),
            };
            assigned_waiter_repository::update_waiter_assignment(db, updated).await
        }
        Ok(None) => Err(format!("waiter with ID {} not found.", staff_id)),
        Err(err) => Err(err),
    }
}

#[command]
pub async fn get_waiter_assignment_by_staff(
    state: State<'_, AppState>,
    staff_id: String,
) -> Result<Option<assigned_waiter::Model>, String> {
    let db = &state.db;
    assigned_waiter_repository::get_assignment_by_staff(db, staff_id).await
}

#[command]
pub async fn delete_waiter_assignment(
    state: State<'_, AppState>,
    staff_id: String,
) -> Result<String, String> {
    let db = &state.db;
    assigned_waiter_repository::delete_assignment_by_staff(db, staff_id).await
}

#[command]
pub async fn get_waiters_by_restaurant(
    state: State<'_, AppState>,
    restaurant_id: String,
) -> Result<Vec<assigned_waiter::Model>, String> {
    let db = &state.db;
    assigned_waiter_repository::get_waiters_by_restaurant(db, restaurant_id).await
}

#[command]
pub async fn count_waiter_by_restaurant_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<u32, String> {
    let db = &state.db;
    assigned_waiter_repository::count_waiter_by_restaurant_id(db, id).await
}
