use chrono::{DateTime, Utc};
use chrono_tz::Asia::Jakarta;
use sea_orm::DatabaseConnection;
use crate::{
    entities::{menu, restaurant_transaction_detail, restaurant_transaction_header},
    repositories::{restaurant_transaction_detail_repository, restaurant_transaction_header_repository},
};

pub async fn generate_header_id(db: &DatabaseConnection) -> String {
    let last_header = restaurant_transaction_header_repository::get_last_header(db)
        .await
        .ok()
        .flatten();

    match last_header {
        Some(header) => {
            let last_id = &header.transaction_id;
            if let Some(num) = last_id.strip_prefix("RT") {
                let last_num: u32 = num.parse::<u32>().unwrap_or(0);
                format!("RT{:03}", last_num + 1)
            } else {
                format!("RT001")
            }
        }
        None => format!("RT001"),
    }
}

pub async fn insert_transaction(
    db: &DatabaseConnection,
    menus: Vec<menu::Model>,
    quantity: Vec<i32>,
    customer_id: String,
    restaurant_id: String,
) -> Result<String, String> {
    let new_id = generate_header_id(db).await;
    let utc_now: DateTime<Utc> = Utc::now();
    let indonesia_now = utc_now.with_timezone(&Jakarta);
    let transaction_date = indonesia_now.with_timezone(&Utc);

    let new_transaction = restaurant_transaction_header::Model {
        transaction_id: new_id.clone(),
        transaction_date,
        customer_id,
        restaurant_id,
    };

    restaurant_transaction_header_repository::insert_restaurant_transaction_header(db, new_transaction).await?;

    for (m, q) in menus.iter().zip(quantity.iter()) {
        let new_detail = restaurant_transaction_detail::Model {
            transaction_id: new_id.clone(),
            menu_history_id: m.menu_history_id.clone(),
            quantity: *q,
        };
        restaurant_transaction_detail_repository::insert_restaurant_transaction_detail(db, new_detail).await?;
    }

    Ok(new_id)
}
