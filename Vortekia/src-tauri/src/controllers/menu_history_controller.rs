use crate::{entities::menu_history, handlers::menu_history_handler, state::AppState};
use tauri::{command, State};

#[command]
pub async fn insert_menu_history(
    state: State<'_, AppState>,
    name: String,
    price: i32
) -> Result<String, String> {
    let db = &state.db;
    menu_history_handler::insert_menu_history(db, name, price).await
}

#[command]
pub async fn get_menu_history(
    state: State<'_, AppState>,
    id: String
) -> Result<menu_history::Model, String> {
    let db = &state.db;
    menu_history_handler::get_menu_history(db, id).await
}
