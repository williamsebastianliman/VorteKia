use crate::{handlers::chat_handler, entities::chat, state::AppState};
use tauri::{command, State};

#[command]
pub async fn insert_new_chat(
    state: State<'_, AppState>,
    sender_staff_id: String,
    group_id: String,
    message: String,
) -> Result<String, String> {
    let db = &state.db;
    chat_handler::insert_chat(db, sender_staff_id, group_id, message).await
}

#[command]
pub async fn get_all_chats_by_group(
    state: State<'_, AppState>,
    group_id: String,
) -> Result<Vec<chat::Model>, String> {
    let db = &state.db;
    chat_handler::get_all_chats_by_group(db, group_id).await
}
