use chrono::{DateTime, Local, Utc};
use sea_orm::DatabaseConnection;

use crate::{
    entities::{souvenir, store_transaction_detail, store_transaction_header}, modules::store_transaction::StoreTransaction, repositories::{store_transaction_detail_repository, store_transaction_header_repository}
};

pub async fn insert_transaction(
    db: &DatabaseConnection,
    souvenirs: Vec<souvenir::Model>,
    quantity: Vec<i32>,
    customer_id: String,
    store_id: String,
) -> Result<String, String> {
    let local_now: DateTime<Local> = Local::now();
    let transaction_date = local_now.with_timezone(&Utc);

    let new_transaction = store_transaction_header::Model {
        transaction_id: 0,
        transaction_date,
        customer_id,
        store_id,
    };

    let inserted_header = match store_transaction_header_repository::insert_store_transaction_header(db, new_transaction).await {
        Ok(header) => header,
        Err(err) => return Err(err),
    };

    let new_id = inserted_header.transaction_id;

    for (s, q) in souvenirs.iter().zip(quantity.iter()) {
        println!("{}", s.souvenir_price);
        let new_detail = store_transaction_detail::Model {
            transaction_id: new_id,
            souvenir_id: s.souvenir_id.clone(),
            quantity: *q,
            price: s.souvenir_price,
        };

        if let Err(err) = store_transaction_detail_repository::insert_store_transaction_detail(db, new_detail).await {
            return Err(err);
        }
    }

    Ok(new_id.to_string())
}



pub async fn get_store_transactions_with_details(
    db: &DatabaseConnection,
    store_id: String,
) -> Result<Vec<StoreTransaction>, String> {
    let headers = store_transaction_header_repository::get_store_transaction_header_by_store(db, store_id).await?;

    let mut result = Vec::new();

    for header in headers {
        let details = store_transaction_detail_repository::get_store_transaction_detail_by_header(db, header.transaction_id.clone()).await?;
        result.push(StoreTransaction { header, details });
    }

    Ok(result)
}