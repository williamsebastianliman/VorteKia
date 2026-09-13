use std::{fs, io::Write, path::Path};
use chrono::NaiveTime;
use sea_orm::DatabaseConnection;
use crate::{entities::store, repositories::store_repository};

pub async fn get_all_stores(db: &DatabaseConnection) -> Result<Vec<store::Model>, String> {
    store_repository::get_all_stores(db).await
}

pub async fn get_store_by_id(db: &DatabaseConnection, id: String) -> Result<store::Model, String> {
    store_repository::get_store_by_id(db, id).await
}

pub async fn update_store_by_id(
    db: &DatabaseConnection,
    id: String,
    name: String,
    description: String,
    image_data: Option<Vec<u8>>,
    open_time: NaiveTime,
    close_time: NaiveTime,
) -> Result<String, String> {
    let existing_store = match store_repository::get_store_by_id(db, id.clone()).await {
        Ok(store) => store,
        Err(err) => return Err(format!("Database error: {}", err)),
    };

    let mut active_model: store::ActiveModel = existing_store.into();

    active_model.store_name = sea_orm::ActiveValue::Set(name.clone());
    active_model.store_description = sea_orm::ActiveValue::Set(description.clone());
    active_model.store_open_time = sea_orm::ActiveValue::Set(open_time);
    active_model.store_close_time = sea_orm::ActiveValue::Set(close_time);

    let storage_folder = "../asset/store";
    fs::create_dir_all(storage_folder).ok();

    if let Some(image_data) = image_data {
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

        let mut file = fs::File::create(&final_path)
            .map_err(|e| format!("Failed to create image file: {}", e))?;

        file.write_all(&image_data)
            .map_err(|e| format!("Failed to write image data: {}", e))?;

        active_model.store_image = sea_orm::ActiveValue::Set(final_path.clone());
    }

    store_repository::update_store(db, active_model)
        .await
        .map_err(|err| format!("Failed to update store: {}", err))?;

    Ok(format!("Store {} updated successfully!", id))
}

pub async fn generate_store_id(db: &DatabaseConnection) -> String {
    let last = store_repository::get_last_store(db).await.ok().flatten();

    match last {
        Some(model) => {
            let last_id = &model.store_id;
            if let Some(num) = last_id.strip_prefix("ST") {
                let last_num: u32 = num.parse::<u32>().unwrap_or(0);
                format!("ST{:03}", last_num + 1)
            } else {
                "ST001".to_string()
            }
        }
        None => "ST001".to_string(),
    }
}

pub async fn insert_store(
    db: &DatabaseConnection,
    name: String,
    description: String,
    location: String,
    open_time: NaiveTime,
    close_time: NaiveTime,
) -> Result<String, String> {
    let new_id = generate_store_id(db).await;
    fs::create_dir_all("../asset/store").ok();

    let new_model = store::Model {
        store_id: new_id,
        store_name: name,
        store_description: description,
        store_location: location,
        store_image: "../asset/store/default_0.png".to_string(),
        store_open_time: open_time,
        store_close_time: close_time,
        staff_id: None,
    };

    store_repository::insert_store(db, new_model).await
}

pub async fn delete_store_by_id(db: &DatabaseConnection, id: String) -> Result<String, String> {
    store_repository::delete_store_by_id(db, id).await
}
