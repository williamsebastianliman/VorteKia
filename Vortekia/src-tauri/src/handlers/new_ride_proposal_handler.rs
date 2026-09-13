use std::fs;
use std::fs::File;
use std::io::Write;
use std::path::Path;
use chrono::NaiveTime;
use sea_orm::DatabaseConnection;
use crate::repositories::new_ride_proposal_repository;
use crate::entities::new_ride_proposal;

async fn generate_proposal_id(db: &DatabaseConnection) -> String {
    let last_proposal = new_ride_proposal_repository::get_last_new_ride_proposal(db).await.ok().flatten();
    match last_proposal {
        Some(proposal) => {
            let last_id = &proposal.proposal_id;
            if let Some(num) = last_id.strip_prefix("NR") {
                let last_num: u32 = num.parse::<u32>().unwrap_or(0);
                format!("NR{:03}", last_num + 1)
            } else {
                "NR001".to_string()
            }
        }
        None => "NR001".to_string(),
    }
}

pub async fn insert_new_ride_proposal(
    db: &DatabaseConnection,
    name: String,
    desc: String,
    price: i32,
    open_time: NaiveTime,
    close_time: NaiveTime,
    file_data: Option<Vec<u8>>,
) -> Result<String, String> {
    let proposal_id = generate_proposal_id(db).await;
    let storage_folder = "../asset/new_ride_proposal";
    fs::create_dir_all(storage_folder).ok();

    let mut final_path = "../asset/new_ride_proposal/default_proposal.pdf".to_string();

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

    let new_proposal = new_ride_proposal::Model {
        proposal_id,
        ride_name: name,
        ride_description: desc,
        ride_close_time: close_time,
        ride_open_time: open_time,
        ride_price: price,
        file_link: final_path,
    };

    new_ride_proposal_repository::insert_new_ride_proposal(db, new_proposal).await
}
