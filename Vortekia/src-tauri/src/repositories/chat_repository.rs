use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, Set, DatabaseConnection};
use crate::entities::chat;

pub async fn insert_chat(db: &DatabaseConnection, new_chat: chat::Model) -> Result<String, String> {
    let active_chat = chat::ActiveModel {
        sender_staff_id: Set(new_chat.sender_staff_id.clone()),
        group_id: Set(new_chat.group_id.clone()),
        message: Set(new_chat.message.clone()),
        timestamp: Set(new_chat.timestamp),
        ..Default::default()
    };

    match active_chat.insert(db).await {
        Ok(_) => Ok(format!("Chat {} inserted successfully!", new_chat.chat_id)),
        Err(err) => Err(format!("Failed to insert chat: {}", err)),
    }
}

pub async fn get_chat_by_group_id(db: &DatabaseConnection, group_id: String) -> Result<Vec<chat::Model>, String> {
    chat::Entity::find()
        .filter(chat::Column::GroupId.eq(group_id.clone()))
        .order_by_asc(chat::Column::Timestamp)
        .all(db)
        .await
        .map_err(|err| format!("Failed to fetch chats for group {}: {}", group_id, err))
}
