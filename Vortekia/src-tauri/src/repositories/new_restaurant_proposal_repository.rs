use sea_orm::{ActiveModelTrait, DatabaseConnection, EntityTrait, Set};
use crate::entities::new_restaurant_proposal;

pub async fn insert_new_restaurant_proposal(
    db: &DatabaseConnection,
    proposal: new_restaurant_proposal::Model,
) -> Result<String, String> {
    let active = new_restaurant_proposal::ActiveModel {
        proposal_id: Set(proposal.proposal_id),
        restaurant_name: Set(proposal.restaurant_name.clone()),
        restaurant_cuisine: Set(proposal.restaurant_cuisine.clone()),
        restaurant_description: Set(proposal.restaurant_description.clone()),
        restaurant_open_time: Set(proposal.restaurant_open_time),
        restaurant_close_time: Set(proposal.restaurant_close_time),
        file_link: Set(proposal.file_link.clone()),
        ..Default::default()
    };

    match active.insert(db).await {
        Ok(_) => Ok(format!(
            "new_restaurant_proposal {} inserted successfully!",
            proposal.proposal_id
        )),
        Err(err) => Err(format!("Failed to insert new_restaurant_proposal: {}", err)),
    }
}

pub async fn delete_new_restaurant_proposal_by_id(
    db: &DatabaseConnection,
    id: i32,
) -> Result<String, String> {
    match new_restaurant_proposal::Entity::delete_by_id(id.clone())
        .exec(db)
        .await
    {
        Ok(delete_result) => {
                Ok(format!("new_restaurant_proposal {} deleted successfully!", id))
        }
        Err(err) => Err(format!("Database error: {}", err)),
    }
}

pub async fn view_all_restaurant_proposals(
    db: &DatabaseConnection,
) -> Result<Vec<new_restaurant_proposal::Model>, String> {
    new_restaurant_proposal::Entity::find()
        .all(db)
        .await
        .map_err(|err| format!("Failed to retrieve restaurant proposals: {}", err))
}