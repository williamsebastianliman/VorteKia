use tauri::{command, State};
use crate::{
    entities::menu, handlers::menu_handler, repositories::menu_repository, state::AppState
};
use super::{menu_history_controller, restaurant_controller};

#[command]
pub async fn get_all_menu_by_restaurant(
    state: State<'_, AppState>,
    id: String
) -> Result<Vec<menu::Model>, String> {
    let db = &state.db;
    menu_handler::get_all_menus_by_restaurant(db, id).await
}

fn parse_integer(input: String) -> Result<i32, String> {
    input.parse::<i32>().map_err(|_| "Invalid integer format".to_string())
}

#[command]
pub async fn insert_menu(
    state: State<'_, AppState>,
    name: String,
    description: String,
    price: String,
    image_data: Option<Vec<u8>>,
    restaurant_id: String
) -> Result<String, String> {
    if name.trim().is_empty() || description.trim().is_empty() || price.trim().is_empty() {
        return Err("All fields must be filled!".to_string());
    }

    let price: i32 = parse_integer(price)?;

    if description.len() < 5 {
        return Err("Description Must Be At Least 5 Characters".to_string());
    }

    if price <= 0 {
        return Err("Price Must Be More than 0".to_string());
    }

    restaurant_controller::get_restaurant_by_id(state.clone(), restaurant_id.clone()).await?;

    let history_id = menu_history_controller::insert_menu_history(state.clone(), name.clone(), price).await?;

    let db = &state.db;
    menu_handler::insert_menu(db, name, description, price, image_data, restaurant_id, history_id).await
}

#[command]
pub async fn update_menu_by_id(
    state: State<'_, AppState>,
    id: String,
    name: String,
    description: String,
    price: String,
    image_data: Option<Vec<u8>>
) -> Result<String, String> {
    if name.trim().is_empty() || description.trim().is_empty() || price.trim().is_empty() {
        return Err("All fields must be filled!".to_string());
    }

    let price: i32 = parse_integer(price)?;

    if description.len() < 5 {
        return Err("Description Must Be At Least 5 Characters".to_string());
    }

    if price <= 0 {
        return Err("Price Must Be More than 0".to_string());
    }

    let history_id = menu_history_controller::insert_menu_history(state.clone(), name.clone(), price).await?;

    let db = &state.db;
    menu_handler::update_menu_by_id(db, id, name, description, price, image_data, history_id).await
}


#[command]
pub async fn delete_menu_by_id(
    state: State<'_, AppState>,
    id: String
) -> Result<String, String> {
    let db = &state.db;
    menu_handler::delete_menu_by_id(db, id).await
}

#[command]
pub async fn get_menu_by_id(
    state: State<'_, AppState>,
    id: String
) -> Result<menu::Model, String> {
    let db = &state.db;
    menu_handler::get_menu_by_id(db, id).await
}

#[command]
pub async fn get_all_menu_by_history_id(
    state: State<'_, AppState>,
    history_id: String,
) -> Result<Vec<menu::Model>, String> {
    let db = &state.db;
    menu_repository::get_all_menu_by_history_id(db, history_id).await
}
