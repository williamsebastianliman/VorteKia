use tauri::{command, State};
use crate::{entities::souvenir, handlers::souvenir_handler, controllers::store_controller, state::AppState};

#[command]
pub async fn get_all_souvenirs_by_store(state: State<'_, AppState>, id: String) -> Result<Vec<souvenir::Model>, String> {
    let db = &state.db;
    souvenir_handler::get_all_souvenirs_by_store(db, id).await
}

fn parse_integer(input: String) -> Result<i32, String> {
    input.parse::<i32>().map_err(|_| "Invalid integer format".to_string())
}

#[command]
pub async fn insert_souvenir(
    state: State<'_, AppState>,
    name: String,
    description: String,
    price: String,
    stock: String,
    image_data: Option<Vec<u8>>,
    store_id: String,
) -> Result<String, String> {
    if name.trim().is_empty() || description.trim().is_empty() || price.trim().is_empty() || stock.trim().is_empty() {
        return Err("All fields must be filled!".to_string());
    }

    let price = parse_integer(price)?;
    let stock = parse_integer(stock)?;

    if description.len() < 5 {
        return Err("Description Must Be At Least 5 Characters".to_string());
    }
    if price <= 0 {
        return Err("Price Must Be More than 0".to_string());
    }
    if stock <= 0 {
        return Err("Stock Must Be More than 0".to_string());
    }

    let db = &state.db;
    store_controller::get_store_by_id(state.clone(), store_id.clone()).await?;

    souvenir_handler::insert_souvenir(db, name, description, price, stock, image_data, store_id).await
}

#[command]
pub async fn update_souvenir_by_id(
    state: State<'_, AppState>,
    id: String,
    name: String,
    description: String,
    price: String,
    stock: String,
    image_data: Option<Vec<u8>>,
) -> Result<String, String> {
    if name.trim().is_empty() || description.trim().is_empty() || price.trim().is_empty() || stock.trim().is_empty() {
        return Err("All fields must be filled!".to_string());
    }

    let price = parse_integer(price)?;
    let stock = parse_integer(stock)?;

    if description.len() < 5 {
        return Err("Description Must Be At Least 5 Characters".to_string());
    }
    if price <= 0 {
        return Err("Price Must Be More than 0".to_string());
    }
    if stock <= 0 {
        return Err("Stock Must Be More than 0".to_string());
    }

    let db = &state.db;
    get_souvenir_by_id(state.clone(), id.clone()).await?;

    souvenir_handler::update_souvenir_by_id(db, id, name, description, price, stock, image_data).await
}

#[command]
pub async fn delete_souvenir_by_id(state: State<'_, AppState>, id: String) -> Result<String, String> {
    let db = &state.db;
    souvenir_handler::delete_souvenir_by_id(db, id).await
}

#[command]
pub async fn get_souvenir_by_id(state: State<'_, AppState>, id: String) -> Result<souvenir::Model, String> {
    let db = &state.db;
    souvenir_handler::get_souvenir_by_id(db, id).await
}
