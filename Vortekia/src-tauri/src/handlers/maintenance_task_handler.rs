use chrono::NaiveDateTime;
use sea_orm::{ActiveValue, DatabaseConnection};

use crate::{entities::maintenance_task, repositories::maintenance_task_repository};

pub async fn generate_maintenance_task_id(db: &DatabaseConnection) -> String {
    let last_task = maintenance_task_repository::get_last_maintenance_task(db).await.ok().flatten();

    match last_task {
        Some(task) => {
            let last_id = &task.task_id;
            if let Some(num) = last_id.strip_prefix("MT") {
                let last_num: u32 = num.parse::<u32>().unwrap_or(0);
                format!("MT{:03}", last_num + 1)
            } else {
                format!("MT001")
            }
        }
        None => format!("MT001"),
    }
}

pub async fn insert_maintenance_task(
    db: &DatabaseConnection,
    name: String,
    description: String,
    ride_id: String,
    staff_id: String,
    time: NaiveDateTime,
) -> Result<String, String> {
    let new_id = generate_maintenance_task_id(db).await;

    let new_task = maintenance_task::Model {
        task_id: new_id,
        task_name: name,
        task_description: description,
        ride_id,
        staff_id,
        status: "Uncompleted".to_string(),
        maintenance_start: time,
    };

    maintenance_task_repository::insert_maintenance_task(db, new_task).await
}

pub async fn get_maintenance_task_by_id(
    db: &DatabaseConnection,
    id: String,
) -> Result<maintenance_task::Model, String> {
    maintenance_task_repository::get_maintenance_task_by_id(db, id).await
}

pub async fn get_all_maintenance_task_by_staff(
    db: &DatabaseConnection,
    staff_id: String,
) -> Result<Vec<maintenance_task::Model>, String> {
    maintenance_task_repository::get_maintenance_task_by_staff(db, staff_id).await
}

pub async fn is_staff_inactive(
    db: &DatabaseConnection,
    staff_id: String,
) -> Result<String, String> {
    match maintenance_task_repository::is_staff_inactive(db, staff_id).await {
        Ok(Some(_)) => Err("You can Only Work In One Job At a Time".to_string()),
        Ok(None) => Ok("Valid Job".to_string()),
        Err(err) => Err(err),
    }
}

pub async fn update_maintenance_task_by_id(
    db: &DatabaseConnection,
    id: String,
    name: String,
    description: String,
    ride_id: String,
    staff_id: String,
    time: NaiveDateTime,
    status: String,
) -> Result<String, String> {
    let existing = maintenance_task_repository::get_maintenance_task_by_id(db, id.clone()).await?;
    let mut active_model: maintenance_task::ActiveModel = existing.into();

    active_model.task_name = ActiveValue::Set(name);
    active_model.task_description = ActiveValue::Set(description);
    active_model.maintenance_start = ActiveValue::Set(time);
    active_model.staff_id = ActiveValue::Set(staff_id);
    active_model.ride_id = ActiveValue::Set(ride_id);
    active_model.status = ActiveValue::Set(status);

    maintenance_task_repository::update_maintenance_task(db, active_model).await?;
    Ok("Maintenance Task Updated Sucessfully!".to_string())
}

pub async fn get_all_maintenance_task(
    db: &DatabaseConnection,
) -> Result<Vec<maintenance_task::Model>, String> {
    maintenance_task_repository::get_all_maintenance_task(db).await
}

pub async fn delete_maintenance_task_by_id(
    db: &DatabaseConnection,
    id: String,
) -> Result<String, String> {
    maintenance_task_repository::delete_maintenance_task_by_id(db, id).await
}

pub async fn update_maintenance_task_status_by_id(
    db: &DatabaseConnection,
    id: String,
    status: String,
) -> Result<String, String> {
    let existing = maintenance_task_repository::get_maintenance_task_by_id(db, id.clone()).await?;
    let mut active_model: maintenance_task::ActiveModel = existing.into();

    active_model.status = ActiveValue::Set(status);

    maintenance_task_repository::update_maintenance_task(db, active_model).await?;
    Ok("Maintenance task Status Has Been Updated Sucessfully!".to_string())
}
