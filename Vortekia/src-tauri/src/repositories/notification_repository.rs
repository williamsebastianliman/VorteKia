use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set,
};

use crate::entities::notification;

pub async fn insert_notification(
    db: &DatabaseConnection,
    customer_id: String,
    message: String,
) -> Result<String, String> {
    let new_notification = notification::ActiveModel {
        customer_id: Set(customer_id),
        message: Set(message),
        ..Default::default()
    };

    match new_notification.insert(db).await {
        Ok(_) => Ok("Notification inserted successfully.".into()),
        Err(e) => Err(format!("Failed to insert notification: {}", e)),
    }
}

pub async fn get_all_notifications_by_customer(
    db: &DatabaseConnection,
    customer_id: String,
) -> Result<Vec<notification::Model>, String> {
    match notification::Entity::find()
        .filter(notification::Column::CustomerId.eq(customer_id))
        .all(db)
        .await
    {
        Ok(notifs) => Ok(notifs),
        Err(e) => Err(format!("Failed to fetch notifications: {}", e)),
    }
}
