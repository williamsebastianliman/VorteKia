use std::fs;
use std::fs::File;
use std::io::Write;
use std::path::Path;
use chrono::NaiveTime;
use sea_orm::DatabaseConnection;
use crate::repositories::new_restaurant_proposal_repository;
use crate::entities::new_restaurant_proposal;

pub async fn insert_new_restaurant_proposal(
    db: &DatabaseConnection,
    name: String,
    cuisine: String,
    desc: String,
    open_time: NaiveTime,
    close_time: NaiveTime,
    file_data: Option<Vec<u8>>,
) -> Result<String, String> {
    let storage_folder = "../asset/new_restaurant_proposal";
    fs::create_dir_all(storage_folder).ok();

    let mut final_path = "../asset/new_restaurant_proposal/default_proposal.pdf".to_string();

    if let Some(file_data) = file_data {
        if !file_data.is_empty() {
            if let Some(kind) = infer::get(&file_data) {
                if kind.extension() != "pdf" {
                    return Err("Invalid file type. Only PDF is allowed.".to_string());
                }
            } else {
                return Err("Failed to detect file type.".to_string());
            }

            let base_name = format!("{}_{}", name.replace(" ", "_"), 0);
            let mut count = 1;
            final_path = format!("{}/{}.pdf", storage_folder, base_name);

            while Path::new(&final_path).exists() {
                final_path = format!("{}/{}_{}.pdf", storage_folder, name.replace(" ", "_"), count);
                count += 1;
            }

            match File::create(&final_path) {
                Ok(mut file) => {
                    if let Err(e) = file.write_all(&file_data) {
                        return Err(format!("Failed to write proposal file: {}", e));
                    }
                }
                Err(e) => return Err(format!("Failed to create proposal file: {}", e)),
            }
        }
    }

    let new_proposal = new_restaurant_proposal::Model {
        proposal_id: 0,
        restaurant_name: name,
        restaurant_cuisine: cuisine,
        restaurant_description: desc,
        restaurant_open_time: open_time,
        restaurant_close_time: close_time,
        file_link: final_path,
    };

    new_restaurant_proposal_repository::insert_new_restaurant_proposal(db, new_proposal).await
}
