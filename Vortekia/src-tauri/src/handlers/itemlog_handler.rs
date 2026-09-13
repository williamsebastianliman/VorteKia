use std::fs;
use std::io::Write;
use std::path::Path;

use sea_orm::{DatabaseConnection, Set};

use crate::repositories::itemlog_repository;
use crate::entities::itemlog;

pub async fn generate_itemlog_id(db: &DatabaseConnection) -> String {
    let last_itemlog = itemlog_repository::get_last_itemlog(db).await.ok().flatten();

    match last_itemlog {
        Some(itemlog) => {
            let last_id = &itemlog.itemlog_id;
            if let Some(num) = last_id.strip_prefix("IL") {
                let last_num: u32 = num.parse::<u32>().unwrap_or(0);
                format!("IL{:03}", last_num + 1)
            } else {
                "IL001".to_string()
            }
        }
        None => "IL001".to_string(),
    }
}

pub async fn insert_itemlog(
    db: &DatabaseConnection,
    name: String,
    item_type: String,
    color: String,
    location: String,
    image_data: Option<Vec<u8>>,
    owner_id: String,
) -> Result<String, String> {
    let new_id = generate_itemlog_id(db).await;
    let storage_folder = "../asset/itemlog";
    fs::create_dir_all(storage_folder).ok();

    let final_path;
    if let Some(image_data) = image_data {
        if !image_data.is_empty() {
            let guessed_format = infer::get(&image_data)
                .map(|kind| kind.extension())
                .unwrap_or("unknown");

            let base_name = format!("{}_{}", name.replace(" ", "_"), 0);
            let mut path = format!("{}/{}.{}", storage_folder, base_name, guessed_format);
            let mut count = 1;

            while Path::new(&path).exists() {
                path = format!("{}/{}_{}.{}", storage_folder, name.replace(" ", "_"), count, guessed_format);
                count += 1;
            }

            match fs::File::create(&path) {
                Ok(mut file) => {
                    if let Err(e) = file.write_all(&image_data) {
                        return Err(format!("Failed to write image data: {}", e));
                    }
                }
                Err(e) => return Err(format!("Failed to create image file: {}", e)),
            }

            final_path = path;
        } else {
            final_path = "../asset/itemlog/default_0.png".to_string();
        }
    } else {
        final_path = "../asset/itemlog/default_0.png".to_string();
    }

    let new_itemlog = itemlog::Model {
        itemlog_id: new_id,
        itemlog_name: name,
        itemlog_type: item_type,
        itemlog_color: color,
        itemlog_location: location,
        customer_id: owner_id,
        itemlog_status: "Missing".to_string(),
        itemlog_image: final_path,
    };

    itemlog_repository::insert_itemlog(db, new_itemlog).await
}

pub async fn get_all_itemlogs(
    db: &DatabaseConnection,
) -> Result<Vec<itemlog::Model>, String> {
    itemlog_repository::get_all_itemlogs(db).await
}

pub async fn delete_itemlog_by_id(
    db: &DatabaseConnection,
    id: String,
) -> Result<String, String> {
    itemlog_repository::delete_itemlog_by_id(db, id).await
}

pub async fn update_itemlog_status_by_id(
    db: &DatabaseConnection,
    id: String,
    value: String,
) -> Result<String, String> {
    let existing_itemlog = itemlog_repository::get_itemlog_by_id(db, id.clone()).await?;
    let mut active_model: itemlog::ActiveModel = existing_itemlog.into();
    active_model.itemlog_status = sea_orm::ActiveValue::Set(value);
    itemlog_repository::update_itemlog(db, active_model).await?;
    Ok(format!("Itemlog {} status updated successfully!", id))
}

pub async fn update_itemlog_by_id(
    db: &DatabaseConnection,
    id: String,
    name: String,
    item_type: String,
    color: String,
    location: String,
    image: String,
    customer_id: String,
    status: String,
) -> Result<String, String> {
    let existing = itemlog_repository::get_itemlog_by_id(db, id.clone()).await?;
    let mut model: itemlog::ActiveModel = existing.into();

    model.itemlog_name = Set(name);
    model.itemlog_type = Set(item_type);
    model.itemlog_color = Set(color);
    model.itemlog_location = Set(location);
    model.itemlog_image = Set(image);
    model.customer_id = Set(customer_id);
    model.itemlog_status = Set(status);

    itemlog_repository::update_itemlog(db, model).await?;
    Ok(format!("Itemlog {} updated successfully", id))
}
