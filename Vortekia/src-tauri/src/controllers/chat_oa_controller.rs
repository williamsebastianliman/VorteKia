use crate::{entities::chat_oa, handlers::chat_oa_handler, state::AppState};
use tauri::{command, State};

#[command]
pub async fn insert_new_chat_oa(
    state: State<'_, AppState>,
    sender_staff_id: String,
    group_id: String,
    message: String,
    is_reply: i8
) -> Result<String, String> {
    let db = &state.db;
    chat_oa_handler::insert_chat_oa(db, sender_staff_id, group_id, message, is_reply).await
}

#[command]
pub async fn get_all_chat_oa_by_group(
    state: State<'_, AppState>,
    group_id: String,
    staff_id: String,
) -> Result<Vec<chat_oa::Model>, String> {
    let db = &state.db;
    chat_oa_handler::get_all_chat_oa_by_group(db, group_id, staff_id).await
}

#[command]
pub async fn get_all_chat_oa_by_real_group(
    state: State<'_, AppState>,
    group_id: String,
) -> Result<Vec<chat_oa::Model>, String> {
    let db = &state.db;
    chat_oa_handler::get_all_chat_oa_by_real_group(db, group_id).await
}
