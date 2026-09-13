use tauri::{command, State};
use sea_orm::ActiveValue::Set;
use crate::entities::assigned_chef;
use crate::repositories::assigned_chef_repository;
use crate::state::AppState;

#[command]
pub async fn insert_chef_assignment(
    state: State<'_, AppState>,
    staff_id: String,
    restaurant_id: String,
    description: String,
) -> Result<String, String> {
    let db = &state.db;
    let new_assignment = assigned_chef::Model {
        staff_id,
        restaurant_id,
        description,
    };

    assigned_chef_repository::insert_chef_assignment(db, new_assignment).await
}

#[command]
pub async fn update_chef_assignment(
    state: State<'_, AppState>,
    staff_id: String,
    new_restaurant_id: String,
    description: String,
) -> Result<String, String> {
    let db = &state.db;
    match assigned_chef_repository::get_assignment_by_staff(db, staff_id.clone()).await {
        Ok(Some(existing)) => {
            let updated = assigned_chef::ActiveModel {
                staff_id: Set(existing.staff_id),
                restaurant_id: Set(new_restaurant_id),
                description: Set(description),
            };

            assigned_chef_repository::update_chef_assignment(db, updated).await
        }
        Ok(None) => Err(format!("Chef with ID {} not found.", staff_id)),
        Err(err) => Err(err),
    }
}

#[command]
pub async fn get_chef_assignment_by_staff(
    state: State<'_, AppState>,
    staff_id: String,
) -> Result<Option<assigned_chef::Model>, String> {
    let db = &state.db;
    assigned_chef_repository::get_assignment_by_staff(db, staff_id).await
}

#[command]
pub async fn delete_chef_assignment(
    state: State<'_, AppState>,
    staff_id: String,
) -> Result<String, String> {
    let db = &state.db;
    assigned_chef_repository::delete_assignment_by_staff(db, staff_id).await
}

#[command]
pub async fn get_chefs_by_restaurant(
    state: State<'_, AppState>,
    restaurant_id: String,
) -> Result<Vec<assigned_chef::Model>, String> {
    let db = &state.db;
    assigned_chef_repository::get_chefs_by_restaurant(db, restaurant_id).await
}

#[command]
pub async fn count_chefs_by_restaurant_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<u32, String> {
    let db = &state.db;
    assigned_chef_repository::count_chefs_by_restaurant_id(db, id).await
}
