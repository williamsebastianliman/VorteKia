use sea_orm::DatabaseConnection;
use crate::{controllers::assigned_ride_staff_controller, entities::ride_queue, repositories::ride_queue_repository};

pub async fn get_queue_by_ride(db: &DatabaseConnection, id: String) -> Result<Vec<ride_queue::Model>, String> {
    ride_queue_repository::get_queue_by_ride(db, id).await
}

pub async fn delete_queue_by_key(db: &DatabaseConnection, ride_id: String, queue_number: i32) -> Result<String, String> {
    ride_queue_repository::delete_queue_by_key(db, ride_id, queue_number).await
}
