use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, Set, DatabaseConnection};
use crate::entities::itemlog;

pub async fn insert_itemlog(db: &DatabaseConnection, new_itemlog: itemlog::Model) -> Result<String, String> {
    let active_itemlog = itemlog::ActiveModel {
        itemlog_id: Set(new_itemlog.itemlog_id.clone()),
        itemlog_type: Set(new_itemlog.itemlog_type.clone()),
        itemlog_name: Set(new_itemlog.itemlog_name.clone()),
        itemlog_color: Set(new_itemlog.itemlog_color.clone()),
        itemlog_location: Set(new_itemlog.itemlog_location.clone()),
        itemlog_image: Set(new_itemlog.itemlog_image.clone()),
        itemlog_status: Set(new_itemlog.itemlog_status.clone()),
        customer_id: Set(new_itemlog.customer_id),
        ..Default::default()
    };

    match active_itemlog.insert(db).await {
        Ok(_) => Ok(format!("Itemlog {} inserted successfully!", new_itemlog.itemlog_id)),
        Err(err) => Err(format!("Failed to insert customer: {}", err)),
    }
}

pub async fn get_last_itemlog(db: &DatabaseConnection) -> Result<Option<itemlog::Model>, String> {
    itemlog::Entity::find()
        .order_by_desc(itemlog::Column::ItemlogId)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}

pub async fn get_all_itemlogs(db: &DatabaseConnection) -> Result<Vec<itemlog::Model>, String> {
    itemlog::Entity::find().all(db).await.map_err(|err| err.to_string())
}

pub async fn delete_itemlog_by_id(db: &DatabaseConnection, id: String) -> Result<String, String> {
    match itemlog::Entity::delete_many()
        .filter(itemlog::Column::ItemlogId.eq(id.clone()))
        .exec(db)
        .await
    {
        Ok(delete_result) => {
            if delete_result.rows_affected > 0 {
                Ok(format!("ItemLog {} deleted successfully.", id))
            } else {
                Err(format!("ItemLog with ID {} not found.", id))
            }
        }
        Err(err) => Err(format!("Database error: {}", err)),
    }
}

pub async fn update_itemlog(db: &DatabaseConnection, new_log: itemlog::ActiveModel) -> Result<String, String> {
    let active_model: itemlog::ActiveModel = new_log.into();
    match active_model.update(db).await {
        Ok(_) => Ok("Itemlog updated successfully!".to_string()),
        Err(err) => Err(format!("Failed to update itemlog: {}", err)),
    }
}

pub async fn get_itemlog_by_id(db: &DatabaseConnection, id: String) -> Result<itemlog::Model, String> {
    match itemlog::Entity::find()
        .filter(itemlog::Column::ItemlogId.eq(id.clone()))
        .one(db)
        .await
    {
        Ok(Some(itemlog)) => Ok(itemlog),
        Ok(None) => Err(format!("Itemlog with id {} not found!", id)),
        Err(err) => Err(format!("Database error: {}", err)),
    }
}
