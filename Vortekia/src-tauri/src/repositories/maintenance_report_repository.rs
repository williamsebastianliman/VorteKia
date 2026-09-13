use crate::entities::maintenance_report;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set, DatabaseConnection};

pub async fn insert_maintenance_report(db: &DatabaseConnection, new_report: maintenance_report::Model) -> Result<String, String> {
    let active_report = maintenance_report::ActiveModel {
        task_id: Set(new_report.task_id.clone()),
        report_status: Set(new_report.report_status.clone()),
        report_description: Set(new_report.report_description.clone()),
        reporting_staff: Set(new_report.reporting_staff.clone()),
        report_image: Set(new_report.report_image.clone()),
        ..Default::default()
    };

    match active_report.insert(db).await {
        Ok(_) => Ok("report inserted successfully!".to_string()),
        Err(err) => Err(format!("Failed to insert report: {}", err)),
    }
}

pub async fn get_maintenance_report_by_id(db: &DatabaseConnection, id: String) -> Result<maintenance_report::Model, String> {
    match maintenance_report::Entity::find()
        .filter(maintenance_report::Column::TaskId.eq(id.clone()))
        .one(db)
        .await
    {
        Ok(Some(report)) => Ok(report),
        Ok(None) => Err(format!("No maintenance_report with such id! {}", id)),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn get_maintenance_report_by_staff(db: &DatabaseConnection, staff_id: String) -> Result<Vec<maintenance_report::Model>, String> {
    maintenance_report::Entity::find()
        .filter(maintenance_report::Column::ReportingStaff.eq(staff_id))
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn is_staff_inactive(db: &DatabaseConnection, staff_id: String) -> Result<Option<maintenance_report::Model>, String> {
    maintenance_report::Entity::find()
        .filter(maintenance_report::Column::ReportingStaff.eq(staff_id))
        .filter(maintenance_report::Column::ReportStatus.eq("On Work"))
        .one(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn update_maintenance_report(db: &DatabaseConnection, new_report: maintenance_report::ActiveModel) -> Result<String, String> {
    let active_model: maintenance_report::ActiveModel = new_report.into();
    match active_model.update(db).await {
        Ok(_) => Ok("report updated successfully!".to_string()),
        Err(err) => Err(format!("Failed to update report: {}", err)),
    }
}

pub async fn get_all_maintenance_report(db: &DatabaseConnection) -> Result<Vec<maintenance_report::Model>, String> {
    maintenance_report::Entity::find().all(db).await.map_err(|err| err.to_string())
}
