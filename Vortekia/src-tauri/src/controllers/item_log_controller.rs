use std::fs;
use std::io::Write;
use std::path::Path;

use tauri::{command, State};
use crate::repositories::itemlog_repository;
use crate::state::AppState;
use crate::entities::itemlog;
use crate::handlers::{itemlog_handler, customer_handler};

#[command]
pub async fn insert_new_itemlog(
    state: State<'_, AppState>,
    name: String,
    item_type: String,
    color: String,
    location: String,
    image_data: Option<Vec<u8>>,
    owner_id: String
) -> Result<String, String> {
    if name.trim().is_empty() || color.trim().is_empty() || item_type.trim().is_empty() || location.trim().is_empty() || owner_id.trim().is_empty() {
        return Err("Fields with * must be filled!".to_string());
    }

    if let Some(ref image) = image_data {
        if !image.is_empty() {
            let valid_formats = ["png", "jpg", "jpeg"];
            let guessed_format = infer::get(image)
                .map(|kind| kind.extension())
                .unwrap_or("unknown");

            if !valid_formats.contains(&guessed_format) {
                return Err("Invalid image format! Only PNG, JPG, and JPEG are allowed.".to_string());
            }
        }
    }

    let db = &state.db;

    match customer_handler::get_customer_by_id(db, owner_id.clone()).await {
        Ok(_) => (),
        Err(err) => return Err(format!("{}", err)),
    };

    itemlog_handler::insert_itemlog(db, name, item_type, color, location, image_data, owner_id).await
}

#[command]
pub async fn get_all_itemlogs(state: State<'_, AppState>) -> Result<Vec<itemlog::Model>, String> {
    let db = &state.db;
    itemlog_handler::get_all_itemlogs(db).await
}

#[command]
pub async fn delete_itemlog_by_id(state: State<'_, AppState>, id: String) -> Result<String, String> {
    let db = &state.db;
    itemlog_handler::delete_itemlog_by_id(db, id).await
}

#[command]
pub async fn update_itemlog_by_id(state: State<'_, AppState>, id: String, value: String) -> Result<String, String> {
    if !(value.trim() == "Missing" || value.trim() == "Returned" || value.trim() == "Found") {
        return Err("Status Not Valid!".to_string());
    }

    let db = &state.db;
    itemlog_handler::update_itemlog_status_by_id(db, id, value).await
}

#[command]
pub async fn update_itemlog_all_by_id(
    state: State<'_, AppState>,
    id: String,
    name: String,
    item_type: String,
    color: String,
    location: String,
    image_data: Option<Vec<u8>>,
    customer_id: String,
    status: String,
) -> Result<String, String> {
    if name.trim().is_empty() || item_type.trim().is_empty() || color.trim().is_empty() {
        return Err("Name, type, and color must not be empty.".into());
    }

    let db = &state.db;
    let existing = itemlog_repository::get_itemlog_by_id(db, id.clone()).await?;
    let mut model: itemlog::ActiveModel = existing.clone().into();

    match status.as_str() {
        "Missing" => {
            if location.trim().is_empty() {
                return Err("Missing items must include last seen location.".into());
            }
            if customer_id.trim().is_empty() {
                return Err("Missing items must include owner information.".into());
            }
        }
        "Found" => {
            let image_missing = existing.itemlog_image == "../asset/itemlog/default_0.png"
                && (image_data.is_none() || image_data.as_ref().unwrap().is_empty());

            if image_missing {
                return Err("Found items must include image.".into());
            }

            if location.trim().is_empty() {
                return Err("Found items must include found location.".into());
            }
            if customer_id.trim().is_empty() {
                return Err("Found items must include finder information (customer_id).".into());
            }
        }
        "Returned" => {}
        _ => return Err("Invalid status provided.".into()),
    }

    model.itemlog_name = sea_orm::ActiveValue::Set(name);
    model.itemlog_type = sea_orm::ActiveValue::Set(item_type);
    model.itemlog_color = sea_orm::ActiveValue::Set(color);
    model.itemlog_location = sea_orm::ActiveValue::Set(location);
    model.customer_id = sea_orm::ActiveValue::Set(customer_id);
    model.itemlog_status = sea_orm::ActiveValue::Set(status);

    let storage_folder = "../asset/itemlog";
    fs::create_dir_all(storage_folder).ok();

    if let Some(image_bytes) = image_data {
        if !image_bytes.is_empty() {
            let guessed_format = infer::get(&image_bytes)
                .map(|kind| kind.extension())
                .unwrap_or("png");

            let base_name =
                format!("{}_{}", model.itemlog_name.as_ref().replace(" ", "_"), 0);
            let mut path =
                format!("{}/{}.{}", storage_folder, base_name, guessed_format);
            let mut count = 1;

            while Path::new(&path).exists() {
                path = format!(
                    "{}/{}_{}.{}",
                    storage_folder, base_name, count, guessed_format
                );
                count += 1;
            }

            match fs::File::create(&path) {
                Ok(mut file) => {
                    file.write_all(&image_bytes)
                        .map_err(|e| format!("Failed to write image: {}", e))?;
                    model.itemlog_image = sea_orm::ActiveValue::Set(path);
                }
                Err(e) => return Err(format!("Image file creation failed: {}", e)),
            }
        }
    }

    itemlog_repository::update_itemlog(db, model).await?;
    Ok("Itemlog updated successfully.".into())
}


fn validate_itemlog_fields(
    status: &str,
    location: &str,
    image: &str,
    customer_id: &str,
) -> Result<(), String> {
    match status {
        "Found" => {
            if image.trim().is_empty() {
                return Err("Found item must include an image.".to_string());
            }
            if location.trim().is_empty() {
                return Err("Found item must include location.".to_string());
            }
        }
        "Missing" => {
            if location.trim().is_empty() {
                return Err("Missing item must include last seen location.".to_string());
            }
            if customer_id.trim().is_empty() {
                return Err("Missing item must include owner information.".to_string());
            }
        }
        _ => {}
    }
    Ok(())
}

#[command]
pub async fn get_itemlog_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<itemlog::Model, String> {
    let db = &state.db;
    itemlog_repository::get_itemlog_by_id(db, id).await
}

