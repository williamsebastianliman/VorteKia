use std::fs::{self, File};
use std::io::Write;
use std::path::Path;

use chrono::NaiveTime;
use tauri::{command, State};

use crate::{
    entities::new_store_proposal,
    repositories::new_store_proposal_repository,
    state::AppState,
};

#[command]
pub async fn insert_new_store_proposal(
    state: State<'_, AppState>,
    name: String,
    desc: String,
    location: String,
    open_time: NaiveTime,
    close_time: NaiveTime,
    file_data: Option<Vec<u8>>,
) -> Result<String, String> {
    let db = &state.db;
    let folder = "../asset/new_store_proposal";
    fs::create_dir_all(folder).ok();

    let mut final_path = format!("{}/default_proposal.pdf", folder);

    if let Some(data) = file_data {
        if !data.is_empty() {
            if let Some(kind) = infer::get(&data) {
                if kind.extension() != "pdf" {
                    return Err("Only PDF files are allowed.".to_string());
                }
            } else {
                return Err("Failed to detect file type.".to_string());
            }

            let mut count = 0;
            let base_name = name.replace(" ", "_");
            loop {
                final_path = format!("{}/{}_{}.pdf", folder, base_name, count);
                if !Path::new(&final_path).exists() {
                    break;
                }
                count += 1;
            }

            let mut file = File::create(&final_path).map_err(|e| e.to_string())?;
            file.write_all(&data).map_err(|e| e.to_string())?;
        }
    }

    let new_model = new_store_proposal::Model {
        proposal_id: 0,
        store_name: name,
        store_description: desc,
        store_location: location,
        store_open_time: open_time,
        store_close_time: close_time,
        file_link: final_path,
    };

    new_store_proposal_repository::insert_new_store_proposal(db, new_model).await
}

#[command]
pub async fn get_last_new_store_proposal(
    state: State<'_, AppState>,
) -> Result<Option<new_store_proposal::Model>, String> {
    let db = &state.db;
    new_store_proposal_repository::get_last_new_store_proposal(db).await
}

#[command]
pub async fn view_all_store_proposals(
    state: State<'_, AppState>,
) -> Result<Vec<new_store_proposal::Model>, String> {
    let db = &state.db;
    new_store_proposal_repository::view_all_store_proposals(db).await
}

#[command]
pub async fn delete_new_store_proposal_by_id(
    id: i32,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let db = &state.db;
    new_store_proposal_repository::delete_new_store_proposal_by_id(db, id).await
}
