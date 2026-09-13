use crate::{entities::ride_removal_proposal, handlers::ride_removal_proposal_handler, repositories::ride_removal_proposal_repository, state::AppState};
use tauri::{command, State};

#[command]
pub async fn insert_ride_removal_proposal(
    ride_id: String,
    removal_description: String,
    file_data: Option<Vec<u8>>,
    state: State<'_, AppState>,
) -> Result<String, String> {
    if ride_id.trim().is_empty() || removal_description.trim().is_empty() {
        return Err("All Field Must Be Filled!".to_string());
    }

    let db = &state.db;

    ride_removal_proposal_handler::insert_ride_removal_proposal(db, ride_id, removal_description, file_data).await
}

#[command]
pub async fn view_all_ride_removal_proposals(
    state: State<'_, AppState>
) -> Result<Vec<ride_removal_proposal::Model>, String> {
    let db = &state.db;
    ride_removal_proposal_repository::view_all_ride_removal_proposals(db).await
}


#[command]
pub async fn delete_ride_removal_proposal_by_id(
    id: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let db = &state.db;
    ride_removal_proposal_repository::delete_ride_removal_proposal_by_id(db, id).await
}