use std::{fs, io::Write, path::Path};
use chrono::NaiveTime;
use sea_orm::DatabaseConnection;
use crate::{entities::restaurant, repositories::restaurant_repository};

pub async fn get_all_restaurants(db: &DatabaseConnection) -> Result<Vec<restaurant::Model>, String> {
    restaurant_repository::get_all_restaurants(db).await
}

pub async fn get_restaurant_by_id(db: &DatabaseConnection, id: String) -> Result<restaurant::Model, String> {
    restaurant_repository::get_restaurant_by_id(db, id).await
}

pub async fn update_restaurant_by_id(
    db: &DatabaseConnection,
    id: String,
    name: String,
    description: String,
    image_data: Option<Vec<u8>>,
    open_time: NaiveTime,
    close_time: NaiveTime,
) -> Result<String, String> {
    let existing_restaurant = restaurant_repository::get_restaurant_by_id(db, id.clone()).await?;
    let mut active_model: restaurant::ActiveModel = existing_restaurant.into();

    active_model.restaurant_name = sea_orm::ActiveValue::Set(name.clone());
    active_model.restaurant_description = sea_orm::ActiveValue::Set(description.clone());
    active_model.restaurant_open_time = sea_orm::ActiveValue::Set(open_time);
    active_model.restaurant_close_time = sea_orm::ActiveValue::Set(close_time);

    let storage_folder = "../asset/restaurant";
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

            match fs::File::create(&final_path) {
                Ok(mut file) => {
                    file.write_all(&image_data).map_err(|e| format!("Failed to write image data: {}", e))?;
                }
                Err(e) => return Err(format!("Failed to create image file: {}", e)),
            }

            active_model.restaurant_image = sea_orm::ActiveValue::Set(final_path);
        }
    }

    restaurant_repository::update_restaurant(db, active_model).await?;
    Ok(format!("Itemlog {} status updated successfully!", id))
}

pub async fn generate_restaurant_id(db: &DatabaseConnection) -> String {
    let last = restaurant_repository::get_last_restaurant(db).await.ok().flatten();

    match last {
        Some(model) => {
            let last_id = &model.restaurant_id;
            if let Some(num) = last_id.strip_prefix("RS") {
                let last_num: u32 = num.parse::<u32>().unwrap_or(0);
                format!("RS{:03}", last_num + 1)
            } else {
                "RS001".to_string()
            }
        }
        None => "RS001".to_string(),
    }
}

pub async fn insert_restaurant(
    db: &DatabaseConnection,
    name: String,
    description: String,
    cuisine: String,
    open_time: NaiveTime,
    close_time: NaiveTime,
    location: String
) -> Result<String, String> {
    let new_id = generate_restaurant_id(db).await;
    fs::create_dir_all("../asset/restaurant").ok();

    let new_model = restaurant::Model {
        restaurant_id: new_id,
        restaurant_name: name,
        restaurant_description: description,
        restaurant_image: "../asset/restaurant/default_0.png".to_string(),
        restaurant_open_time: open_time,
        restaurant_close_time: close_time,
        restaurant_cuisine: cuisine,
        restaurant_location: location,
    };

    restaurant_repository::insert_restaurant(db, new_model).await
}

pub async fn delete_restaurant_by_id(db: &DatabaseConnection, id: String) -> Result<String, String> {
    restaurant_repository::delete_restaurant_by_id(db, id).await
}
