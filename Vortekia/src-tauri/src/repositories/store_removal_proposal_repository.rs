use sea_orm::{ActiveModelTrait, EntityTrait, QueryOrder, Set};
use sea_orm::DatabaseConnection;
use crate::entities::store_removal_proposal;

pub async fn insert_store_removal_proposal(
    db: &DatabaseConnection,
    new_store_removal_proposal: store_removal_proposal::Model,
) -> Result<String, String> {
    let active_model = store_removal_proposal::ActiveModel {
        proposal_id: Set(new_store_removal_proposal.proposal_id.clone()),
        store_id: Set(new_store_removal_proposal.store_id.clone()),
        removal_description: Set(new_store_removal_proposal.removal_description.clone()),
        file_link: Set(new_store_removal_proposal.file_link.clone()),
        ..Default::default()
    };

    match active_model.insert(db).await {
        Ok(_) => Ok(format!(
            "store_removal_proposal {} inserted successfully!",
            new_store_removal_proposal.proposal_id
        )),
        Err(err) => Err(format!("Failed to insert store_removal_proposal: {}", err)),
    }
}

pub async fn view_all_store_removal_proposals(
    db: &DatabaseConnection,
) -> Result<Vec<store_removal_proposal::Model>, String> {
    store_removal_proposal::Entity::find()
        .order_by_asc(store_removal_proposal::Column::ProposalId)
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn delete_store_removal_proposal_by_id(
    db: &DatabaseConnection,
    id: i32,
) -> Result<String, String> {
    match store_removal_proposal::Entity::delete_by_id(id.clone())
        .exec(db)
        .await
    {
        Ok(delete_result) => {
                Ok(format!("store_removal_proposal {} deleted successfully!", id))
        }
        Err(err) => Err(format!("Database error: {}", err)),
    }
}

