use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, Set, DatabaseConnection};
use crate::entities::broadcast;

pub async fn insert_broadcast(db: &DatabaseConnection, new_broadcast: broadcast::Model) -> Result<String, String> {
    let active_broadcast = broadcast::ActiveModel {
        broadcast_type: Set(new_broadcast.broadcast_type.clone()),
        broadcast_message: Set(new_broadcast.broadcast_message.clone()),
        timestamp: Set(new_broadcast.timestamp),
        ..Default::default()
    };

    match active_broadcast.insert(db).await {
        Ok(_) => Ok(format!(
            "Broadcast of type '{}' inserted successfully!",
            new_broadcast.broadcast_type
        )),
        Err(err) => Err(format!("Failed to insert broadcast: {}", err)),
    }
}

pub async fn get_all_broadcasts_by_type(db: &DatabaseConnection, b_type: String) -> Result<Vec<broadcast::Model>, String> {
    broadcast::Entity::find()
        .filter(broadcast::Column::BroadcastType.eq(b_type.clone()))
        .order_by_desc(broadcast::Column::Timestamp)
        .all(db)
        .await
        .map_err(|err| format!("Failed to fetch broadcasts for type '{}': {}", b_type, err))
}
