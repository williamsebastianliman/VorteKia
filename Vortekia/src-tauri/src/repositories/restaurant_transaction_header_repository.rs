use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder, Set};
use crate::entities::restaurant_transaction_header;

pub async fn insert_restaurant_transaction_header(
    db: &DatabaseConnection,
    new_header: restaurant_transaction_header::Model,
) -> Result<String, String> {
    let active_model = restaurant_transaction_header::ActiveModel {
        transaction_id: Set(new_header.transaction_id),
        transaction_date: Set(new_header.transaction_date),
        customer_id: Set(new_header.customer_id),
        restaurant_id: Set(new_header.restaurant_id),
        ..Default::default()
    };

    active_model
        .insert(db)
        .await
        .map(|_| "Transaction header has been inserted successfully!".to_string())
        .map_err(|err| err.to_string())
}

pub async fn get_restaurant_transaction_header_by_restaurant(
    db: &DatabaseConnection,
    id: String,
) -> Result<Vec<restaurant_transaction_header::Model>, String> {
    restaurant_transaction_header::Entity::find()
        .filter(restaurant_transaction_header::Column::RestaurantId.eq(id))
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn get_last_header(
    db: &DatabaseConnection,
) -> Result<Option<restaurant_transaction_header::Model>, String> {
    restaurant_transaction_header::Entity::find()
        .order_by_desc(restaurant_transaction_header::Column::TransactionId)
        .one(db)
        .await
        .map_err(|err| err.to_string())
}
