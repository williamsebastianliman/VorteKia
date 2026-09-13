use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, Set};
use sea_orm::DatabaseConnection;
use crate::entities::store_transaction_header;

pub async fn insert_store_transaction_header(
    db: &DatabaseConnection,
    new_header: store_transaction_header::Model,
) -> Result<store_transaction_header::Model, String> {
    let active_model = store_transaction_header::ActiveModel {
        transaction_date: Set(new_header.transaction_date),
        customer_id: Set(new_header.customer_id),
        store_id: Set(new_header.store_id),
        ..Default::default()
    };

    active_model.insert(db).await.map_err(|err| format!("Failed to insert: {}", err))
}

pub async fn get_store_transaction_header_by_store(
    db: &DatabaseConnection,
    id: String,
) -> Result<Vec<store_transaction_header::Model>, String> {
    store_transaction_header::Entity::find()
        .filter(store_transaction_header::Column::StoreId.eq(id))
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn get_last_store_header(
    db: &DatabaseConnection,
) -> Result<Option<store_transaction_header::Model>, String> {
    store_transaction_header::Entity::find()
        .order_by_desc(store_transaction_header::Column::TransactionId)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}
