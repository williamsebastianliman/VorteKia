use std::{fs, io::Write, path::Path};
use sea_orm::DatabaseConnection;
use crate::repositories::souvenir_repository;
use crate::entities::souvenir;

pub async fn get_all_souvenirs_by_store(db: &DatabaseConnection, id: String) -> Result<Vec<souvenir::Model>, String> {
    souvenir_repository::get_all_souvenirs_by_store(db, id).await
}

pub async fn generate_souvenir_id(db: &DatabaseConnection) -> String {
    let last_souvenir = souvenir_repository::get_last_souvenir(db).await.ok().flatten();

    match last_souvenir {
        Some(souvenir) => {
            let last_id = &souvenir.souvenir_id;
            if let Some(num) = last_id.strip_prefix("SV") {
                let last_num: u32 = num.parse::<u32>().unwrap_or(0);
                format!("SV{:03}", last_num + 1)
            } else {
                format!("SV001")
            }
        }
        None => format!("SV001"),
    }
}

pub async fn insert_souvenir(
    db: &DatabaseConnection,
    name: String,
    description: String,
    price: i32,
    stock: i32,
    image_data: Option<Vec<u8>>,
    store_id: String,
) -> Result<String, String> {
    let new_id = generate_souvenir_id(db).await;
    let storage_folder = "../asset/souvenir";
    fs::create_dir_all(storage_folder).ok();

    let mut final_path;
    if let Some(image_data) = image_data {
        if !image_data.is_empty() {
            let guessed_format = infer::get(&image_data)
                .map(|kind| kind.extension())
                .unwrap_or("unknown");

            let base_name = format!("{}_{}", name.replace(" ", "_"), 0);
            final_path = format!("{}/{}.{}", storage_folder, base_name, guessed_format);
            let mut count = 1;

            while Path::new(&final_path).exists() {
                final_path = format!("{}/{}_{}.{}", storage_folder, name.replace(" ", "_"), count, guessed_format);
                count += 1;
            }

            match fs::File::create(&final_path) {
                Ok(mut file) => {
                    if let Err(e) = file.write_all(&image_data) {
                        return Err(format!("Failed to write image data: {}", e));
                    }
                }
                Err(e) => return Err(format!("Failed to create image file: {}", e)),
            }
        } else {
            final_path = "../asset/souvenir/default_0.png".to_string();
        }
    } else {
        final_path = "../asset/souvenir/default_0.png".to_string();
    }

    let new_souvenir = souvenir::Model {
        souvenir_id: new_id,
        souvenir_name: name,
        souvenir_description: description,
        souvenir_price: price,
        souvenir_stock: stock,
        souvenir_image: final_path,
        store_id,
    };

    souvenir_repository::insert_souvenir(db, new_souvenir).await
}

pub async fn update_souvenir_by_id(
    db: &DatabaseConnection,
    id: String,
    name: String,
    description: String,
    price: i32,
    stock: i32,
    image_data: Option<Vec<u8>>,
) -> Result<String, String> {
    let existing_souvenir = match souvenir_repository::get_souvenir_by_id(db, id.clone()).await {
        Ok(souvenir) => souvenir,
        Err(err) => return Err(format!("Database error: {}", err)),
    };

    let mut active_model: souvenir::ActiveModel = existing_souvenir.into();

    active_model.souvenir_name = sea_orm::ActiveValue::Set(name.clone());
    active_model.souvenir_description = sea_orm::ActiveValue::Set(description.clone());
    active_model.souvenir_price = sea_orm::ActiveValue::Set(price);
    active_model.souvenir_stock = sea_orm::ActiveValue::Set(stock);

    let storage_folder = "../asset/souvenir";
    fs::create_dir_all(storage_folder).ok();

    if let Some(image_data) = image_data {
        if !image_data.is_empty() {
            let guessed_format = infer::get(&image_data)
                .map(|kind| kind.extension())
                .unwrap_or("unknown");

            let base_name = format!("{}_{}", name.replace(" ", "_"), 0);
            let mut final_path = format!("{}/{}.{}", storage_folder, base_name, guessed_format);
            let mut count = 1;

            while Path::new(&final_path).exists() {
                final_path = format!("{}/{}_{}.{}", storage_folder, name.replace(" ", "_"), count, guessed_format);
                count += 1;
            }

            match fs::File::create(&final_path) {
                Ok(mut file) => {
                    if let Err(e) = file.write_all(&image_data) {
                        return Err(format!("Failed to write image data: {}", e));
                    }
                }
                Err(e) => return Err(format!("Failed to create image file: {}", e)),
            }

            active_model.souvenir_image = sea_orm::ActiveValue::Set(final_path);
        }
    }

    souvenir_repository::update_souvenir(db, active_model).await
}

pub async fn delete_souvenir_by_id(db: &DatabaseConnection, id: String) -> Result<String, String> {
    souvenir_repository::delete_souvenir_by_id(db, id).await
}

pub async fn get_souvenir_by_id(db: &DatabaseConnection, id: String) -> Result<souvenir::Model, String> {
    souvenir_repository::get_souvenir_by_id(db, id).await
}
