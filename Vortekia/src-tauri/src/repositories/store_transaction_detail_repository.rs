use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set};
use sea_orm::DatabaseConnection;
use crate::entities::store_transaction_detail;

pub async fn insert_store_transaction_detail(
    db: &DatabaseConnection,
    new_detail: store_transaction_detail::Model,
) -> Result<String, String> {
    let active_model = store_transaction_detail::ActiveModel {
        transaction_id: Set(new_detail.transaction_id.clone()),
        souvenir_id: Set(new_detail.souvenir_id.clone()),
        quantity: Set(new_detail.quantity.clone()),
        price: Set(new_detail.price.clone()),
        ..Default::default()
    };

    match active_model.insert(db).await {
        Ok(_) => Ok("Store transaction detail has been inserted successfully!".to_string()),
        Err(err) => Err(format!("{}", err)),
    }
}

pub async fn get_store_transaction_detail_by_header(
    db: &DatabaseConnection,
    id: i32,
) -> Result<Vec<store_transaction_detail::Model>, String> {
    store_transaction_detail::Entity::find()
        .filter(store_transaction_detail::Column::TransactionId.eq(id))
        .all(db)
        .await
        .map_err(|err| err.to_string())
}
