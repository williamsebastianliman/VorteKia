use crate::{entities::new_ride_proposal, handlers::new_ride_proposal_handler, repositories::{new_ride_proposal_repository, new_store_proposal_repository}, state::AppState};
use chrono::NaiveTime;
use tauri::{command, State};

fn parse_integer(input: String) -> Result<i32, String> {
    input
        .parse::<i32>()
        .map_err(|_| "Invalid integer format".to_string())
}

#[command]
pub async fn insert_new_ride_proposal(
    state: State<'_, AppState>,
    name: String,
    desc: String,
    price: String,
    open_time: NaiveTime,
    close_time: NaiveTime,
    file_data: Option<Vec<u8>>,
) -> Result<String, String> {
    let db = &state.db;

    if name.trim().is_empty() || desc.trim().is_empty() || price.trim().is_empty() {
        return Err("All Field Must Be Filled!".to_string());
    }

    let price: i32 = match parse_integer(price) {
        Ok(val) => val,
        Err(err) => return Err(err),
    };

    if desc.len() < 5 {
        return Err("Description Must Be At least 5 Characters!".to_string());
    }

    let min_time = NaiveTime::from_hms_opt(7, 0, 0).unwrap();
    let max_time = NaiveTime::from_hms_opt(19, 0, 0).unwrap();

    if !(min_time..=max_time).contains(&open_time) {
        return Err("Open time must be between 7:00 AM and 7:00 PM!".to_string());
    }

    if !(min_time..=max_time).contains(&close_time) {
        return Err("Close time must be between 7:00 AM and 7:00 PM!".to_string());
    }

    new_ride_proposal_handler::insert_new_ride_proposal(
        db,
        name,
        desc,
        price,
        open_time,
        close_time,
        file_data,
    )
    .await
}

#[command]
pub async fn delete_new_ride_proposal_by_id(
    id: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let db = &state.db;
    new_ride_proposal_repository::delete_new_ride_proposal_by_id(db, id).await
}

#[command]
pub async fn view_all_ride_proposals(
    state: State<'_, AppState>,
) -> Result<Vec<new_ride_proposal::Model>, String> {
    let db = &state.db;
    new_ride_proposal_repository::view_all_ride_proposals(db).await
}