use crate::repositories::customer_repository;
use crate::entities::customer;
use chrono::Datelike;
use sea_orm::{DatabaseConnection};
use sea_orm::sqlx::types::chrono::Utc;
use rand::Rng;

pub async fn generate_customer_id(db: &DatabaseConnection) -> String {
    let last_customer = customer_repository::get_last_customer(db).await.ok().flatten();
    let year = Utc::now().year() % 100;
    let random_number = rand::thread_rng().gen_range(100..=999);

    match last_customer {
        Some(customer) => {
            let last_id = &customer.customer_id;
            if let Some(num_part) = last_id.strip_prefix("CU") {
                if num_part.len() >= 10 {
                    let last_num = num_part[5..].parse::<u32>().unwrap_or(0);
                    format!("CU{}{}{:05}", year, random_number, last_num + 1)
                } else {
                    format!("CU{}{}00001", year, random_number)
                }
            } else {
                format!("CU{}{}00001", year, random_number)
            }
        }
        None => format!("CU{}{}00001", year, random_number),
    }
}

pub async fn insert_customer(
    db: &DatabaseConnection,
    name: String,
    email: String,
    phone: String
) -> Result<String, String> {
    let new_id = generate_customer_id(db).await;
    let new_customer = customer::Model {
        customer_id: new_id,
        customer_name: name,
        customer_email: email,
        customer_phone_number: phone,
        customer_balance: 0,
    };

    customer_repository::insert_customer(db, new_customer).await
}

pub async fn get_customers_by_name_prefix(
    db: &DatabaseConnection,
    prefix: String
) -> Result<Vec<customer::Model>, String> {
    customer_repository::get_customers_by_name_prefix(db, prefix).await
}

pub async fn get_customer_by_id(
    db: &DatabaseConnection,
    id: String
) -> Result<customer::Model, String> {
    customer_repository::get_customer_by_id(db, id).await
}
