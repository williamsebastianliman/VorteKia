use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, Set, DatabaseConnection};
use crate::entities::inquries_response;

pub async fn insert_response(db: &DatabaseConnection, new_response: inquries_response::Model) -> Result<String, String> {
    let active_response = inquries_response::ActiveModel {
        customer_id: Set(new_response.customer_id.clone()),
        message: Set(new_response.message.clone()),
        timestamp: Set(new_response.timestamp),
        ..Default::default()
    };

    match active_response.insert(db).await {
        Ok(_) => Ok(format!("Response inserted for customer {}", new_response.customer_id)),
        Err(err) => Err(format!("Failed to insert response: {}", err)),
    }
}

pub async fn get_responses_by_customer_id(db: &DatabaseConnection, customer_id: String) -> Result<Vec<inquries_response::Model>, String> {
    inquries_response::Entity::find()
        .filter(inquries_response::Column::CustomerId.eq(customer_id.clone()))
        .order_by_asc(inquries_response::Column::Timestamp)
        .all(db)
        .await
        .map_err(|err| format!("Failed to fetch responses for customer {}: {}", customer_id, err))
}
