use chrono::{DateTime, Local, NaiveDateTime};
use crate::{entities::chat, repositories::chat_repository};

pub async fn insert_chat(
    db: &sea_orm::DatabaseConnection,
    sender_staff_id: String,
    group_id: String,
    message: String,
) -> Result<String, String> {
    let local_dt: DateTime<Local> = Local::now();
    let naive_dt: NaiveDateTime = local_dt.naive_local();

    let new_chat = chat::Model {
        chat_id: 0,
        sender_staff_id,
        group_id,
        message,
        timestamp: naive_dt,
    };

    chat_repository::insert_chat(db, new_chat).await
}

pub async fn get_all_chats_by_group(
    db: &sea_orm::DatabaseConnection,
    group_id: String,
) -> Result<Vec<chat::Model>, String> {
    chat_repository::get_chat_by_group_id(db, group_id).await
}
