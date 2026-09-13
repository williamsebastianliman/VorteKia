use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder, Set};

use crate::entities::ride;

pub async fn get_all_rides(db: &DatabaseConnection) -> Result<Vec<ride::Model>, String> {
    ride::Entity::find()
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn get_ride_by_id(db: &DatabaseConnection, id: String) -> Result<ride::Model, String> {
    match ride::Entity::find()
        .filter(ride::Column::RideId.eq(id.clone()))
        .one(db)
        .await
    {
        Ok(Some(ride)) => Ok(ride),
        Ok(None) => Err("No ride with such id!".to_string()),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn update_ride(db: &DatabaseConnection, new_ride: ride::ActiveModel) -> Result<String, String> {
    new_ride
        .update(db)
        .await
        .map(|_| "ride updated successfully!".to_string())
        .map_err(|err| format!("Failed to update ride: {}", err))
}

pub async fn insert_ride(db: &DatabaseConnection, new_model: ride::Model) -> Result<String, String> {
    let new_active = ride::ActiveModel {
        ride_id: Set(new_model.ride_id),
        ride_name: Set(new_model.ride_name),
        ride_description: Set(new_model.ride_description),
        ride_price: Set(new_model.ride_price),
        ride_image: Set(new_model.ride_image),
        ride_open_time: Set(new_model.ride_open_time),
        ride_close_time: Set(new_model.ride_close_time),
    };

    match new_active.insert(db).await {
        Ok(_) => Ok("Ride inserted successfully!".to_string()),
        Err(err) => Err(format!("Failed to insert ride: {}", err)),
    }
}

pub async fn delete_ride_by_id(db: &DatabaseConnection, id: String) -> Result<String, String> {
    match ride::Entity::delete_many()
        .filter(ride::Column::RideId.eq(id.clone()))
        .exec(db)
        .await
    {
        Ok(result) => {
            if result.rows_affected > 0 {
                Ok(format!("Ride {} deleted successfully!", id))
            } else {
                Err(format!("Ride with ID {} not found.", id))
            }
        }
        Err(err) => Err(format!("Failed to delete ride: {}", err)),
    }
}

pub async fn get_last_ride(db: &DatabaseConnection) -> Result<Option<ride::Model>, String> {
    ride::Entity::find()
        .order_by_desc(ride::Column::RideId)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}


