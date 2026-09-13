use std::{fs, io::Write, path::Path};
use sea_orm::{ActiveValue, DatabaseConnection};

use crate::{entities::maintenance_report, repositories::maintenance_report_repository};

pub async fn insert_maintenance_report(
    db: &DatabaseConnection,
    id: String,
    staff_id: String,
    description: String,
    status: String,
) -> Result<String, String> {
    let new_report = maintenance_report::Model {
        task_id: id,
        reporting_staff: staff_id,
        report_description: format!("Notes From Manager (You May Erase this): {}", description),
        report_image: "../asset/maintenance_report/default_0.png".to_string(),
        report_status: status,
    };

    maintenance_report_repository::insert_maintenance_report(db, new_report).await
}

pub async fn get_all_maintenance_report_by_staff(
    db: &DatabaseConnection,
    staff_id: String,
) -> Result<Vec<maintenance_report::Model>, String> {
    maintenance_report_repository::get_maintenance_report_by_staff(db, staff_id).await
}

pub async fn get_maintenance_report_by_id(
    db: &DatabaseConnection,
    id: String,
) -> Result<maintenance_report::Model, String> {
    maintenance_report_repository::get_maintenance_report_by_id(db, id).await
}

pub async fn is_staff_inactive(
    db: &DatabaseConnection,
    staff_id: String,
) -> Result<String, String> {
    match maintenance_report_repository::is_staff_inactive(db, staff_id).await {
        Ok(Some(_)) => Err("You can Only Work In One Job At a Time".to_string()),
        Ok(None) => Ok("Valid Job".to_string()),
        Err(err) => Err(err),
    }
}

pub async fn get_all_maintenance_report(
    db: &DatabaseConnection,
) -> Result<Vec<maintenance_report::Model>, String> {
    maintenance_report_repository::get_all_maintenance_report(db).await
}

pub async fn update_maintenance_report_status_by_id(
    db: &DatabaseConnection,
    id: String,
    status: String,
) -> Result<String, String> {
    let existing = maintenance_report_repository::get_maintenance_report_by_id(db, id.clone()).await?;
    let mut active_model: maintenance_report::ActiveModel = existing.into();
    active_model.report_status = ActiveValue::Set(status);
    maintenance_report_repository::update_maintenance_report(db, active_model).await?;
    Ok("Maintenance Report Status Has Been Updated Sucessfully!".to_string())
}

pub async fn update_maintenance_report_by_id(
    db: &DatabaseConnection,
    id: String,
    description: String,
    image_data: Option<Vec<u8>>,
    status: String,
) -> Result<String, String> {
    let existing = maintenance_report_repository::get_maintenance_report_by_id(db, id.clone()).await?;
    let mut active_model: maintenance_report::ActiveModel = existing.into();

    active_model.report_description = ActiveValue::Set(description);
    active_model.report_status = ActiveValue::Set(status);

    let storage_folder = "../asset/maintenance_report";
    fs::create_dir_all(storage_folder).ok();

    if let Some(image_data) = image_data {
        if !image_data.is_empty() {
            let guessed_format = infer::get(&image_data).map(|kind| kind.extension()).unwrap_or("unknown");
            let base_name = format!("{}_{}", id.replace(" ", "_"), 0);
            let mut final_path = format!("{}/{}.{}", storage_folder, base_name, guessed_format);
            let mut count = 1;

            while Path::new(&final_path).exists() {
                final_path = format!("{}/{}_{}.{}", storage_folder, id.replace(" ", "_"), count, guessed_format);
                count += 1;
            }

            match fs::File::create(&final_path) {
                Ok(mut file) => file.write_all(&image_data).map_err(|e| format!("Failed to write image data: {}", e))?,
                Err(e) => return Err(format!("Failed to create image file: {}", e)),
            }

            active_model.report_image = ActiveValue::Set(final_path);
        }
    }

    maintenance_report_repository::update_maintenance_report(db, active_model).await?;
    Ok(format!("Maintenance Report {} Has Been Updated Sucessfully!", id))
}
