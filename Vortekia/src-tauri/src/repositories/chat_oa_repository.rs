use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, Set, DatabaseConnection};
use crate::entities::chat_oa;

pub async fn insert_chat_oa(db: &DatabaseConnection, new_chat_oa: chat_oa::Model) -> Result<String, String> {
    let active_chat_oa = chat_oa::ActiveModel {
        sender_staff_id: Set(new_chat_oa.sender_staff_id.clone()),
        oa_id: Set(new_chat_oa.oa_id.clone()),
        message: Set(new_chat_oa.message.clone()),
        timestamp: Set(new_chat_oa.timestamp),
        is_reply: Set(new_chat_oa.is_reply.clone()),
        ..Default::default()
    };

    match active_chat_oa.insert(db).await {
        Ok(_) => Ok(format!("chat_oa {} inserted successfully!", new_chat_oa.oa_id)),
        Err(err) => Err(format!("Failed to insert chat_oa: {}", err)),
    }
}

pub async fn get_chat_oa_by_group_id(db: &DatabaseConnection, group_id: String, staff_id: String) -> Result<Vec<chat_oa::Model>, String> {
    chat_oa::Entity::find()
        .filter(chat_oa::Column::OaId.eq(group_id.clone()))
        .filter(chat_oa::Column::SenderStaffId.eq(staff_id.clone()))
        .order_by_asc(chat_oa::Column::Timestamp)
        .all(db)
        .await
        .map_err(|err| format!("Failed to fetch chat_oas for group {}: {}", group_id, err))
}

pub async fn get_chat_oa_by_real_group_id(db: &DatabaseConnection, group_id: String) -> Result<Vec<chat_oa::Model>, String> {
    chat_oa::Entity::find()
        .filter(chat_oa::Column::OaId.eq(group_id.clone()))
        .order_by_asc(chat_oa::Column::Timestamp)
        .all(db)
        .await
        .map_err(|err| format!("Failed to fetch chat_oas for group {}: {}", group_id, err))
}
