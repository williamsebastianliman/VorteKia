use std::fs::{self, File};
use std::io::Write;
use std::path::Path;

use crate::{
    entities::store_removal_proposal,
    repositories::store_removal_proposal_repository,
    state::AppState,
};

use tauri::{command, State};

#[command]
pub async fn insert_store_removal_proposal(
    state: State<'_, AppState>,
    store_id: String,
    removal_description: String,
    file_data: Vec<u8>,
) -> Result<String, String> {
    let db = &state.db;
    let folder = "../asset/store_removal_proposal";
    fs::create_dir_all(folder).ok();

    let mut final_path = format!("{}/default_proposal.pdf", folder);

    if !file_data.is_empty() {
        if let Some(kind) = infer::get(&file_data) {
            if kind.extension() != "pdf" {
                return Err("Only PDF files are allowed.".to_string());
            }
        } else {
            return Err("Failed to detect file type.".to_string());
        }

        let base_name = store_id.replace(" ", "_");
        let mut count = 0;
        loop {
            final_path = format!("{}/{}_{}.pdf", folder, base_name, count);
            if !Path::new(&final_path).exists() {
                break;
            }
            count += 1;
        }

        let mut file = File::create(&final_path).map_err(|e| e.to_string())?;
        file.write_all(&file_data).map_err(|e| e.to_string())?;
    }

    let model = store_removal_proposal::Model {
        proposal_id: 0,
        store_id,
        removal_description,
        file_link: final_path,
    };

    store_removal_proposal_repository::insert_store_removal_proposal(db, model).await
}

#[command]
pub async fn get_all_store_removal_proposals(
    state: State<'_, AppState>,
) -> Result<Vec<store_removal_proposal::Model>, String> {
    let db = &state.db;
    store_removal_proposal_repository::view_all_store_removal_proposals(db).await
}

#[command]
pub async fn delete_store_removal_proposal_by_id(
    id: i32,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let db = &state.db;
    store_removal_proposal_repository::delete_store_removal_proposal_by_id(db, id).await
}
