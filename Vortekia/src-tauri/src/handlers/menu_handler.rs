use std::{fs, io::Write, path::Path};
use crate::{entities::menu, repositories::menu_repository};
use sea_orm::DatabaseConnection;

pub async fn get_all_menus_by_restaurant(db: &DatabaseConnection, id: String) -> Result<Vec<menu::Model>, String> {
    menu_repository::get_all_menu_by_restaurant(db, id).await
}

pub async fn generate_menu_id(db: &DatabaseConnection) -> String {
    let last_menu = menu_repository::get_last_menu(db).await.ok().flatten();
    match last_menu {
        Some(menu) => {
            let last_id = &menu.menu_id;
            if let Some(num) = last_id.strip_prefix("MN") {
                let last_num: u32 = num.parse::<u32>().unwrap_or(0);
                format!("MN{:03}", last_num + 1)
            } else {
                format!("MN001")
            }
        }
        None => format!("MN001"),
    }
}

pub async fn insert_menu(
    db: &DatabaseConnection,
    name: String,
    description: String,
    price: i32,
    image_data: Option<Vec<u8>>,
    restaurant_id: String,
    history_id: String,
) -> Result<String, String> {
    let new_id = generate_menu_id(db).await;
    let storage_folder = "../asset/menu";
    fs::create_dir_all(storage_folder).ok();
    let mut final_path = "../asset/menu/default_0.png".to_string();

    if let Some(image_data) = image_data {
        if !image_data.is_empty() {
            let guessed_format = infer::get(&image_data).map(|kind| kind.extension()).unwrap_or("unknown");
            let base_name = format!("{}_{}", name.replace(" ", "_"), 0);
            final_path = format!("{}/{}.{}", storage_folder, base_name, guessed_format);
            let mut count = 1;
            while Path::new(&final_path).exists() {
                final_path = format!("{}/{}_{}.{}", storage_folder, name.replace(" ", "_"), count, guessed_format);
                count += 1;
            }
            let mut file = fs::File::create(&final_path).map_err(|e| format!("Failed to create image file: {}", e))?;
            file.write_all(&image_data).map_err(|e| format!("Failed to write image data: {}", e))?;
        }
    }

    let new_menu = menu::Model {
        menu_id: new_id,
        menu_name: name,
        menu_description: description,
        menu_price: price,
        menu_image: final_path,
        restaurant_id,
        menu_history_id: history_id,
    };

    menu_repository::insert_menu(db, new_menu).await
}

pub async fn update_menu_by_id(
    db: &DatabaseConnection,
    id: String,
    name: String,
    description: String,
    price: i32,
    image_data: Option<Vec<u8>>,
    history_id: String,
) -> Result<String, String> {
    let existing_menu = menu_repository::get_menu_by_id(db, id.clone()).await?;
    let mut active_model: menu::ActiveModel = existing_menu.into();
    active_model.menu_name = sea_orm::ActiveValue::Set(name.clone());
    active_model.menu_description = sea_orm::ActiveValue::Set(description);
    active_model.menu_price = sea_orm::ActiveValue::Set(price);
    active_model.menu_history_id = sea_orm::ActiveValue::Set(history_id);

    let storage_folder = "../asset/menu";
    fs::create_dir_all(storage_folder).ok();

    if let Some(image_data) = image_data {
        if !image_data.is_empty() {
            let guessed_format = infer::get(&image_data).map(|kind| kind.extension()).unwrap_or("unknown");
            let base_name = format!("{}_{}", name.replace(" ", "_"), 0);
            let mut final_path = format!("{}/{}.{}", storage_folder, base_name, guessed_format);
            let mut count = 1;
            while Path::new(&final_path).exists() {
                final_path = format!("{}/{}_{}.{}", storage_folder, name.replace(" ", "_"), count, guessed_format);
                count += 1;
            }
            let mut file = fs::File::create(&final_path).map_err(|e| format!("Failed to create image file: {}", e))?;
            file.write_all(&image_data).map_err(|e| format!("Failed to write image data: {}", e))?;
            active_model.menu_image = sea_orm::ActiveValue::Set(final_path);
        }
    }

    menu_repository::update_menu(db, active_model).await?;
    Ok(format!("Menu {} status updated successfully!", id))
}

pub async fn delete_menu_by_id(db: &DatabaseConnection, id: String) -> Result<String, String> {
    menu_repository::delete_menu_by_id(db, id).await
}

pub async fn get_menu_by_id(db: &DatabaseConnection, id: String) -> Result<menu::Model, String> {
    menu_repository::get_menu_by_id(db, id).await
}
