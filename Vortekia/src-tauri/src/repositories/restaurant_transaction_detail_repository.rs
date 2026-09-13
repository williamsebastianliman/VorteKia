use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};
use crate::entities::restaurant_transaction_detail;

pub async fn insert_restaurant_transaction_detail(
    db: &DatabaseConnection,
    new_detail: restaurant_transaction_detail::Model,
) -> Result<String, String> {
    let active_model = restaurant_transaction_detail::ActiveModel {
        transaction_id: Set(new_detail.transaction_id.clone()),
        menu_history_id: Set(new_detail.menu_history_id.clone()),
        quantity: Set(new_detail.quantity.clone()),
        ..Default::default()
    };

    active_model
        .insert(db)
        .await
        .map(|_| "Transaction detail has been inserted successfully!".to_string())
        .map_err(|err| err.to_string())
}

pub async fn get_restaurant_transaction_detail_by_header(
    db: &DatabaseConnection,
    id: String,
) -> Result<Vec<restaurant_transaction_detail::Model>, String> {
    restaurant_transaction_detail::Entity::find()
        .filter(restaurant_transaction_detail::Column::TransactionId.eq(id))
        .all(db)
        .await
        .map_err(|err| err.to_string())
}
