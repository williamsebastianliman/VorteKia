use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set, DatabaseConnection};
use crate::entities::assigned_ride_staff;

pub async fn insert_schedule(db: &DatabaseConnection, new_schedule: assigned_ride_staff::Model) -> Result<String, String> {
    let active_schedule = assigned_ride_staff::ActiveModel {
        ride_id: Set(new_schedule.ride_id.clone()),
        staff_id: Set(new_schedule.staff_id.clone()),
        shift: Set(new_schedule.shift.clone()),
        ..Default::default()
    };

    match active_schedule.insert(db).await {
        Ok(_) => Ok("Schedule inserted successfully!".to_string()),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn update_schedule(db: &DatabaseConnection, new_schedule: assigned_ride_staff::ActiveModel) -> Result<String, String> {
    match new_schedule.update(db).await {
        Ok(_) => Ok("Schedule updated successfully!".to_string()),
        Err(err) => Err(format!("Failed to update ride schedule: {}", err)),
    }
}

pub async fn get_schedule_by_key(db: &DatabaseConnection, ride_id: String, shift: i32) -> Result<Option<assigned_ride_staff::Model>, String> {
    assigned_ride_staff::Entity::find()
        .filter(assigned_ride_staff::Column::RideId.eq(ride_id))
        .filter(assigned_ride_staff::Column::Shift.eq(shift))
        .one(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn delete_schedule_by_key(db: &DatabaseConnection, ride_id: String, shift: i32) -> Result<String, String> {
    let result = assigned_ride_staff::Entity::delete_many()
        .filter(assigned_ride_staff::Column::RideId.eq(ride_id))
        .filter(assigned_ride_staff::Column::Shift.eq(shift))
        .exec(db)
        .await;

    match result {
        Ok(res) if res.rows_affected > 0 => Ok("Ride Schedule deleted successfully.".to_string()),
        Ok(_) => Err("Ride Schedule with ID not found.".to_string()),
        Err(err) => Err(format!("Database error: {}", err)),
    }
}

pub async fn get_staff_availibility(db: &DatabaseConnection, id: String, shift: i32) -> Result<String, String> {
    match assigned_ride_staff::Entity::find()
        .filter(assigned_ride_staff::Column::StaffId.eq(id))
        .filter(assigned_ride_staff::Column::Shift.eq(shift))
        .one(db)
        .await
    {
        Ok(Some(schedule)) => Err(schedule.ride_id),
        Ok(None) => Ok("Valid Schedule".to_string()),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn get_ride_by_schedule(db: &DatabaseConnection, id: String, shift: i32) -> Result<Option<assigned_ride_staff::Model>, String> {
    assigned_ride_staff::Entity::find()
        .filter(assigned_ride_staff::Column::StaffId.eq(id))
        .filter(assigned_ride_staff::Column::Shift.eq(shift))
        .one(db)
        .await
        .map_err(|err| err.to_string())
}
