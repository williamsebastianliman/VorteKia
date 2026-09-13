use sea_orm::{ActiveModelTrait, EntityTrait, QueryOrder, Set, DatabaseConnection};
use crate::entities::new_ride_proposal;

pub async fn insert_new_ride_proposal(
    db: &DatabaseConnection,
    new_ride_proposal: new_ride_proposal::Model,
) -> Result<String, String> {
    let active_new_ride_proposal = new_ride_proposal::ActiveModel {
        proposal_id: Set(new_ride_proposal.proposal_id.clone()),
        ride_name: Set(new_ride_proposal.ride_name.clone()),
        ride_description: Set(new_ride_proposal.ride_description.clone()),
        ride_open_time: Set(new_ride_proposal.ride_open_time.clone()),
        ride_close_time: Set(new_ride_proposal.ride_close_time.clone()),
        file_link: Set(new_ride_proposal.file_link.clone()),
        ride_price: Set(new_ride_proposal.ride_price.clone()),
        ..Default::default()
    };

    match active_new_ride_proposal.insert(db).await {
        Ok(_) => Ok(format!(
            "new_ride_proposal {} inserted successfully!",
            new_ride_proposal.proposal_id
        )),
        Err(err) => Err(format!("Failed to insert new_ride_proposal: {}", err)),
    }
}

pub async fn get_last_new_ride_proposal(
    db: &DatabaseConnection,
) -> Result<Option<new_ride_proposal::Model>, String> {
    new_ride_proposal::Entity::find()
        .order_by_desc(new_ride_proposal::Column::ProposalId)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}

pub async fn delete_new_ride_proposal_by_id(
    db: &DatabaseConnection,
    id: String,
) -> Result<String, String> {
    match new_ride_proposal::Entity::delete_by_id(id.clone())
        .exec(db)
        .await
    {
        Ok(delete_result) => {
                Ok(format!("new_ride_proposal {} deleted successfully.", id))
        }
        Err(err) => Err(format!("Database error: {}", err)),
    }
}

pub async fn view_all_ride_proposals(
    db: &DatabaseConnection,
) -> Result<Vec<new_ride_proposal::Model>, String> {
    new_ride_proposal::Entity::find()
        .all(db)
        .await
        .map_err(|err| format!("Failed to retrieve ride proposals: {}", err))
}
