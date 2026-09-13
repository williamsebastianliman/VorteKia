use crate::entities::maintenance_task;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, Set, DatabaseConnection};

pub async fn insert_maintenance_task(db: &DatabaseConnection, new_task: maintenance_task::Model) -> Result<String, String> {
    let active_task = maintenance_task::ActiveModel {
        task_id: Set(new_task.task_id.clone()),
        task_name: Set(new_task.task_name.clone()),
        task_description: Set(new_task.task_description.clone()),
        status: Set(new_task.status.clone()),
        ride_id: Set(new_task.ride_id.clone()),
        staff_id: Set(new_task.staff_id.clone()),
        maintenance_start: Set(new_task.maintenance_start.clone()),
        ..Default::default()
    };

    match active_task.insert(db).await {
        Ok(_) => Ok("Task inserted successfully!".to_string()),
        Err(err) => Err(format!("Failed to insert task: {}", err)),
    }
}

pub async fn get_last_maintenance_task(db: &DatabaseConnection) -> Result<Option<maintenance_task::Model>, String> {
    maintenance_task::Entity::find()
        .order_by_desc(maintenance_task::Column::TaskId)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}

pub async fn get_maintenance_task_by_id(db: &DatabaseConnection, id: String) -> Result<maintenance_task::Model, String> {
    match maintenance_task::Entity::find()
        .filter(maintenance_task::Column::TaskId.eq(id.clone()))
        .one(db)
        .await
    {
        Ok(Some(task)) => Ok(task),
        Ok(None) => Err(format!("No maintenance_task with such id! {}", id)),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn get_maintenance_task_by_staff(db: &DatabaseConnection, staff_id: String) -> Result<Vec<maintenance_task::Model>, String> {
    maintenance_task::Entity::find()
        .filter(maintenance_task::Column::StaffId.eq(staff_id))
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn is_staff_inactive(db: &DatabaseConnection, staff_id: String) -> Result<Option<maintenance_task::Model>, String> {
    maintenance_task::Entity::find()
        .filter(maintenance_task::Column::StaffId.eq(staff_id))
        .filter(maintenance_task::Column::Status.eq("On Work"))
        .one(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn update_maintenance_task(db: &DatabaseConnection, new_task: maintenance_task::ActiveModel) -> Result<String, String> {
    let active_model: maintenance_task::ActiveModel = new_task.into();
    match active_model.update(db).await {
        Ok(_) => Ok("task updated successfully!".to_string()),
        Err(err) => Err(format!("Failed to update task: {}", err)),
    }
}

pub async fn get_all_maintenance_task(db: &DatabaseConnection) -> Result<Vec<maintenance_task::Model>, String> {
    maintenance_task::Entity::find()
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn delete_maintenance_task_by_id(db: &DatabaseConnection, id: String) -> Result<String, String> {
    match maintenance_task::Entity::delete_many()
        .filter(maintenance_task::Column::TaskId.eq(id.clone()))
        .exec(db)
        .await
    {
        Ok(delete_result) => {
            if delete_result.rows_affected > 0 {
                Ok(format!("maintenance_task {} deleted successfully.", id))
            } else {
                Err(format!("maintenance_task with ID {} not found.", id))
            }
        }
        Err(err) => Err(format!("Database error: {}", err)),
    }
}

pub async fn is_ride_not_under_maintenance(db: &DatabaseConnection, ride_id: String) -> Result<bool, String> {
    let tasks = maintenance_task::Entity::find()
        .filter(maintenance_task::Column::RideId.eq(ride_id))
        .all(db)
        .await
        .map_err(|err| err.to_string())?;

    if tasks.is_empty() {
        return Ok(true);
    }

    for task in tasks {
        if task.status != "Finished" {
            return Ok(false);
        }
    }

    Ok(true)
}
