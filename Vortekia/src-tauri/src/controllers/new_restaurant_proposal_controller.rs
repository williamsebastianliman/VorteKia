use crate::{entities::new_restaurant_proposal, handlers::new_restaurant_proposal_handler, repositories::new_restaurant_proposal_repository, state::AppState};
use chrono::NaiveTime;
use tauri::{command, State};

fn parse_string(input: String) -> Result<String, String> {
    if input.trim().is_empty() {
        Err("Field must not be empty!".to_string())
    } else {
        Ok(input)
    }
}

#[command]
pub async fn insert_new_restaurant_proposal(
    state: State<'_, AppState>,
    name: String,
    cuisine: String,
    desc: String,
    open_time: NaiveTime,
    close_time: NaiveTime,
    file_data: Option<Vec<u8>>,
) -> Result<String, String> {
    let db = &state.db;

    let name = parse_string(name)?;
    let cuisine = parse_string(cuisine)?;
    let desc = parse_string(desc)?;

    if desc.len() < 5 {
        return Err("Description must be at least 5 characters!".to_string());
    }

    let min_time = NaiveTime::from_hms_opt(7, 0, 0).unwrap();
    let max_time = NaiveTime::from_hms_opt(19, 0, 0).unwrap();

    if !(min_time..=max_time).contains(&open_time) {
        return Err("Open time must be between 7:00 AM and 7:00 PM!".to_string());
    }

    if !(min_time..=max_time).contains(&close_time) {
        return Err("Close time must be between 7:00 AM and 7:00 PM!".to_string());
    }

    new_restaurant_proposal_handler::insert_new_restaurant_proposal(
        db,
        name,
        cuisine,
        desc,
        open_time,
        close_time,
        file_data,
    )
    .await
}

#[command]
pub async fn delete_new_restaurant_proposal_by_id(
    state: State<'_, AppState>,
    id: i32,
) -> Result<String, String> {
    let db = &state.db;
    new_restaurant_proposal_repository::delete_new_restaurant_proposal_by_id(db, id).await
}


#[command]
pub async fn view_all_restaurant_proposals(
    state: State<'_, AppState>,
) -> Result<Vec<new_restaurant_proposal::Model>, String> {
    let db = &state.db;
    new_restaurant_proposal_repository::view_all_restaurant_proposals(db).await
}
