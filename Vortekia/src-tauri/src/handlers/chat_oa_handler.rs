use chrono::{DateTime, Local, NaiveDateTime};
use sea_orm::DatabaseConnection;
use crate::entities::chat_oa;
use crate::repositories::chat_oa_repository;

pub async fn insert_chat_oa(
    db: &DatabaseConnection,
    sender_staff_id: String,
    group_id: String,
    message: String,
    is_reply: i8,
) -> Result<String, String> {
    let local_dt: DateTime<Local> = Local::now();
    let naive_dt: NaiveDateTime = local_dt.naive_local();

    let new_chat = chat_oa::Model {
        chat_id: 0,
        sender_staff_id,
        oa_id: group_id,
        message,
        timestamp: naive_dt,
        is_reply,
    };

    chat_oa_repository::insert_chat_oa(db, new_chat).await
}

pub async fn get_all_chat_oa_by_group(
    db: &DatabaseConnection,
    group_id: String,
    staff_id: String,
) -> Result<Vec<chat_oa::Model>, String> {
    chat_oa_repository::get_chat_oa_by_group_id(db, group_id, staff_id).await
}

pub async fn get_all_chat_oa_by_real_group(
    db: &DatabaseConnection,
    group_id: String,
) -> Result<Vec<chat_oa::Model>, String> {
    chat_oa_repository::get_chat_oa_by_real_group_id(db, group_id).await
}
