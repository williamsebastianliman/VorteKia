use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, QueryFilter, QueryOrder, Set};
use crate::entities::ride_queue;

pub async fn get_queue_by_ride(db: &DatabaseConnection, ride_id: String) -> Result<Vec<ride_queue::Model>, String> {
    ride_queue::Entity::find()
        .filter(ride_queue::Column::RideId.eq(ride_id))
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn delete_queue_by_key(db: &DatabaseConnection, ride_id: String, queue_number: i32) -> Result<String, String> {
    let result = ride_queue::Entity::delete_many()
        .filter(ride_queue::Column::RideId.eq(ride_id.clone()))
        .filter(ride_queue::Column::QueueNumber.eq(queue_number))
        .exec(db)
        .await
        .map_err(|err| err.to_string())?;

    if result.rows_affected > 0 {
        Ok("Queue deleted successfully.".to_string())
    } else {
        Err(format!("Queue not {} {} found.", ride_id, queue_number))
    }
}

pub async fn insert_queue_by_customer(db: &DatabaseConnection, customer_id: String, ride_id: String) -> Result<String, String> {
    let last_queue = ride_queue::Entity::find()
        .filter(ride_queue::Column::RideId.eq(ride_id.clone()))
        .order_by_desc(ride_queue::Column::QueueNumber)
        .one(db)
        .await
        .map_err(|err| err.to_string())?;

    let next_queue_number = match last_queue {
        Some(q) => q.queue_number + 1,
        None => 1,
    };

    let new_queue = ride_queue::ActiveModel {
        customer_id: Set(customer_id),
        ride_id: Set(ride_id),
        queue_number: Set(next_queue_number),
    };

    new_queue
        .insert(db)
        .await
        .map(|_| "Queue inserted successfully.".to_string())
        .map_err(|err| err.to_string())
}

pub async fn update_queue_customer_by_queue_number(
    db: &DatabaseConnection,
    ride_id: String,
    queue_number: i32,
    new_customer_id: String,
) -> Result<String, String> {
    let existing = ride_queue::Entity::find()
        .filter(ride_queue::Column::RideId.eq(ride_id.clone()))
        .filter(ride_queue::Column::QueueNumber.eq(queue_number))
        .one(db)
        .await
        .map_err(|err| err.to_string())?;

    let mut queue = match existing {
        Some(q) => q.into_active_model(),
        None => return Err("Queue entry not found.".to_string()),
    };

    queue.customer_id = Set(new_customer_id);

    queue
        .update(db)
        .await
        .map(|_| "Queue customer updated successfully.".to_string())
        .map_err(|err| err.to_string())
}
