use std::{fs, io::Write, path::Path};
use chrono::NaiveTime;
use sea_orm::DatabaseConnection;
use crate::{entities::ride, repositories::ride_repository};

pub async fn get_all_rides(db: &DatabaseConnection) -> Result<Vec<ride::Model>, String> {
    ride_repository::get_all_rides(db).await
}

pub async fn get_ride_by_id(db: &DatabaseConnection, id: String) -> Result<ride::Model, String> {
    ride_repository::get_ride_by_id(db, id).await
}

pub async fn update_ride_by_id(
    db: &DatabaseConnection,
    id: String,
    name: String,
    description: String,
    image_data: Option<Vec<u8>>,
    open_time: NaiveTime,
    close_time: NaiveTime,
) -> Result<String, String> {
    let existing_ride = ride_repository::get_ride_by_id(db, id.clone()).await?;

    let mut active_model: ride::ActiveModel = existing_ride.into();
    active_model.ride_name = sea_orm::ActiveValue::Set(name.clone());
    active_model.ride_description = sea_orm::ActiveValue::Set(description.clone());
    active_model.ride_open_time = sea_orm::ActiveValue::Set(open_time);
    active_model.ride_close_time = sea_orm::ActiveValue::Set(close_time);

    let storage_folder = "../asset/ride";
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

        active_model.ride_image = sea_orm::ActiveValue::Set(final_path.clone());
    }

    ride_repository::update_ride(db, active_model).await?;
    Ok(format!("Ride {} updated successfully!", id))
}


pub async fn generate_ride_id(db: &DatabaseConnection) -> String {
    let last_ride = ride_repository::get_last_ride(db).await.ok().flatten();

    match last_ride {
        Some(ride) => {
            let last_id = &ride.ride_id;
            if let Some(num) = last_id.strip_prefix("RD") {
                let last_num: u32 = num.parse::<u32>().unwrap_or(0);
                format!("RD{:03}", last_num + 1)
            } else {
                "RD001".to_string()
            }
        }
        None => "RD001".to_string(),
    }
}

pub async fn insert_ride(
    db: &DatabaseConnection,
    name: String,
    description: String,
    price: String,
    open_time: NaiveTime,
    close_time: NaiveTime,
) -> Result<String, String> {
    let new_id = generate_ride_id(db).await;
    fs::create_dir_all("../asset/ride").ok();

    let image_path = "../asset/ride/default_0.png".to_string();

    let new_model = ride::Model {
        ride_id: new_id,
        ride_name: name,
        ride_description: description,
        ride_price: price,
        ride_image: image_path,
        ride_open_time: open_time,
        ride_close_time: close_time,
    };

    ride_repository::insert_ride(db, new_model).await
}

pub async fn delete_ride_by_id(db: &DatabaseConnection, id: String) -> Result<String, String> {
    ride_repository::delete_ride_by_id(db, id).await
}
