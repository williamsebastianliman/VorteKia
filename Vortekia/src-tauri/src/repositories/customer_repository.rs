use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, QuerySelect, Set, DatabaseConnection};
use crate::entities::customer;

pub async fn insert_customer(db: &DatabaseConnection, new_customer: customer::Model) -> Result<String, String> {
    let active_customer = customer::ActiveModel {
        customer_id: Set(new_customer.customer_id.clone()),
        customer_name: Set(new_customer.customer_name.clone()),
        customer_email: Set(new_customer.customer_email.clone()),
        customer_balance: Set(0),
        customer_phone_number: Set(new_customer.customer_phone_number.clone()),
        ..Default::default()
    };

    match active_customer.insert(db).await {
        Ok(_) => Ok(format!("Customer {} inserted successfully!", new_customer.customer_id)),
        Err(err) => Err(format!("Failed to insert customer: {}", err)),
    }
}

pub async fn get_last_customer(db: &DatabaseConnection) -> Result<Option<customer::Model>, String> {
    customer::Entity::find()
        .order_by(Expr::cust("RIGHT(customer_id, 5)"), sea_orm::Order::Desc)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}

pub async fn get_customers_by_name_prefix(db: &DatabaseConnection, prefix: String) -> Result<Vec<customer::Model>, String> {
    customer::Entity::find()
        .filter(customer::Column::CustomerName.starts_with(prefix))
        .limit(5)
        .all(db)
        .await
        .map_err(|err| format!("Database query error: {}", err))
}

pub async fn get_customer_by_id(db: &DatabaseConnection, id: String) -> Result<customer::Model, String> {
    match customer::Entity::find()
        .filter(customer::Column::CustomerId.eq(id.clone()))
        .one(db)
        .await
    {
        Ok(Some(customer)) => Ok(customer),
        Ok(None) => Err(format!("Customer with id {} not found!", id)),
        Err(err) => Err(format!("Database error: {}", err)),
    }
}

pub async fn update_customer_balance_by_id(db: &DatabaseConnection, id: String, new_balance: i32) -> Result<String, String> {
    let customer = customer::Entity::find()
        .filter(customer::Column::CustomerId.eq(id.clone()))
        .one(db)
        .await
        .map_err(|err| format!("Failed to fetch customer: {}", err))?;

    let customer = match customer {
        Some(c) => c,
        None => return Err(format!("Customer with ID {} not found", id)),
    };

    let mut active_customer: customer::ActiveModel = customer.into();
    active_customer.customer_balance = Set(new_balance);

    match active_customer.update(db).await {
        Ok(_) => Ok(format!("Balance updated successfully for customer {}", id)),
        Err(err) => Err(format!("Failed to update balance: {}", err)),
    }
}
