use std::fs;
use std::fs::File;
use std::io::Write;
use std::path::Path;
use sea_orm::DatabaseConnection;
use crate::repositories::ride_removal_proposal_repository;
use crate::entities::ride_removal_proposal;

pub async fn generate_proposal_id(db: &DatabaseConnection) -> String {
    let last_proposal = ride_removal_proposal_repository::get_last_ride_removal_proposal(db).await.ok().flatten();

    match last_proposal {
        Some(proposal) => {
            let last_id = &proposal.proposal_id;
            if let Some(num) = last_id.strip_prefix("RP") {
                let last_num: u32 = num.parse::<u32>().unwrap_or(0);
                format!("RP{:03}", last_num + 1)
            } else {
                format!("RP001")
            }
        }
        None => format!("RP001"),
    }
}

pub async fn insert_ride_removal_proposal(
    db: &DatabaseConnection,
    ride_id: String,
    removal_description: String,
    file_data: Option<Vec<u8>>,
) -> Result<String, String> {
    let proposal_id = generate_proposal_id(db).await;
    let storage_folder = "../asset/removal_proposals";
    fs::create_dir_all(storage_folder).ok();

    let mut final_path = "../asset/removal_proposals/default_proposal.pdf".to_string();

    if let Some(file_data) = file_data {
        if !file_data.is_empty() {
            if let Some(kind) = infer::get(&file_data) {
                if kind.extension() != "pdf" {
                    return Err("Invalid file type. Only PDF is allowed.".to_string());
                }
            } else {
                return Err("Failed to detect file type.".to_string());
            }

            let base_name = format!("{}_{}", ride_id.replace(" ", "_"), 0);
            let mut count = 1;
            final_path = format!("{}/{}.pdf", storage_folder, base_name);

            while Path::new(&final_path).exists() {
                final_path = format!("{}/{}_{}.pdf", storage_folder, ride_id.replace(" ", "_"), count);
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

    let new_proposal = ride_removal_proposal::Model {
        proposal_id,
        ride_id,
        removal_description,
        proposal_file: final_path,
    };

    ride_removal_proposal_repository::insert_ride_removal_proposal(db, new_proposal).await
}

