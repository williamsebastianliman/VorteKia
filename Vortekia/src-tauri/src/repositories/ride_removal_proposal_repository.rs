use sea_orm::{ActiveModelTrait, DatabaseConnection, EntityTrait, QueryOrder, Set};
use crate::entities::ride_removal_proposal;

pub async fn insert_ride_removal_proposal(
    db: &DatabaseConnection,
    new_ride_removal_proposal: ride_removal_proposal::Model,
) -> Result<String, String> {
    let active_ride_removal_proposal = ride_removal_proposal::ActiveModel {
        proposal_id: Set(new_ride_removal_proposal.proposal_id.clone()),
        ride_id: Set(new_ride_removal_proposal.ride_id.clone()),
        removal_description: Set(new_ride_removal_proposal.removal_description.clone()),
        proposal_file: Set(new_ride_removal_proposal.proposal_file.clone()),
        ..Default::default()
    };

    active_ride_removal_proposal
        .insert(db)
        .await
        .map(|_| format!("ride_removal_proposal {} inserted successfully!", new_ride_removal_proposal.proposal_id))
        .map_err(|err| format!("Failed to insert ride_removal_proposal: {}", err))
}

pub async fn get_last_ride_removal_proposal(
    db: &DatabaseConnection,
) -> Result<Option<ride_removal_proposal::Model>, String> {
    ride_removal_proposal::Entity::find()
        .order_by_desc(ride_removal_proposal::Column::ProposalId)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}

pub async fn view_all_ride_removal_proposals(
    db: &DatabaseConnection,
) -> Result<Vec<ride_removal_proposal::Model>, String> {
    ride_removal_proposal::Entity::find()
        .all(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}

pub async fn delete_ride_removal_proposal_by_id(
    db: &DatabaseConnection,
    id: String,
) -> Result<String, String> {
    println!("kepanggil brp??");
    match ride_removal_proposal::Entity::delete_by_id(id.clone())
        .exec(db)
        .await
    {
        Ok(_) => {Ok(format!("ride_removal_proposal {} deleted successfully.", id.clone()))}
        Err(err) => Err(format!("Database error: {}", err)),
    }
}