use sea_orm::{ActiveModelTrait, EntityTrait, QueryOrder, Set, DatabaseConnection};
use crate::entities::new_store_proposal;

pub async fn insert_new_store_proposal(
    db: &DatabaseConnection,
    new_store_proposal: new_store_proposal::Model,
) -> Result<String, String> {
    let active_model = new_store_proposal::ActiveModel {
        proposal_id: Set(new_store_proposal.proposal_id.clone()),
        store_name: Set(new_store_proposal.store_name.clone()),
        store_description: Set(new_store_proposal.store_description.clone()),
        store_open_time: Set(new_store_proposal.store_open_time.clone()),
        store_close_time: Set(new_store_proposal.store_close_time.clone()),
        store_location: Set(new_store_proposal.store_location.clone()),
        file_link: Set(new_store_proposal.file_link.clone()),
        ..Default::default()
    };

    match active_model.insert(db).await {
        Ok(_) => Ok(format!(
            "new_store_proposal {} inserted successfully!",
            new_store_proposal.proposal_id
        )),
        Err(err) => Err(format!("Failed to insert new_store_proposal: {}", err)),
    }
}

pub async fn get_last_new_store_proposal(
    db: &DatabaseConnection,
) -> Result<Option<new_store_proposal::Model>, String> {
    new_store_proposal::Entity::find()
        .order_by_desc(new_store_proposal::Column::ProposalId)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}

pub async fn view_all_store_proposals(
    db: &DatabaseConnection,
) -> Result<Vec<new_store_proposal::Model>, String> {
    new_store_proposal::Entity::find()
        .all(db)
        .await
        .map_err(|err| format!("Failed to retrieve store proposals: {}", err))
}

pub async fn delete_new_store_proposal_by_id(
    db: &DatabaseConnection,
    id: i32,
) -> Result<String, String> {
    match new_store_proposal::Entity::delete_by_id(id.clone())
        .exec(db)
        .await
    {
        Ok(delete_result) => {
                Ok(format!("new_store_proposal {} deleted successfully.", id))
        }
        Err(err) => Err(format!("Database error: {}", err)),
    }
}

