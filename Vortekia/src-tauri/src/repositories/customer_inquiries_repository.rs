use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, QuerySelect, QueryTrait, Set, DatabaseConnection};
use crate::entities::{customer, customer_inquiries};

pub async fn insert_inquiries(db: &DatabaseConnection, new_inquiries: customer_inquiries::Model) -> Result<String, String> {
    let active_inquiries = customer_inquiries::ActiveModel {
        sender_customer_id: Set(new_inquiries.sender_customer_id.clone()),
        message: Set(new_inquiries.message.clone()),
        timestamp: Set(new_inquiries.timestamp),
        ..Default::default()
    };

    match active_inquiries.insert(db).await {
        Ok(_) => Ok(format!("inquiries {} inserted successfully!", new_inquiries.chat_id)),
        Err(err) => Err(format!("Failed to insert inquiries: {}", err)),
    }
}

pub async fn get_inquiries_by_group_id(db: &DatabaseConnection, group_id: String) -> Result<Vec<customer_inquiries::Model>, String> {
    customer_inquiries::Entity::find()
        .filter(customer_inquiries::Column::SenderCustomerId.eq(group_id.clone()))
        .order_by_asc(customer_inquiries::Column::Timestamp)
        .all(db)
        .await
        .map_err(|err| format!("Failed to fetch inquiriess for group {}: {}", group_id, err))
}

pub async fn get_all_customers_inquired(db: &DatabaseConnection) -> Result<Vec<customer::Model>, String> {
    let subquery = customer_inquiries::Entity::find()
        .select_only()
        .column(customer_inquiries::Column::SenderCustomerId)
        .distinct()
        .into_query();

    customer::Entity::find()
        .filter(customer::Column::CustomerId.in_subquery(subquery))
        .all(db)
        .await
        .map_err(|err| format!("Failed to fetch customers who inquired: {}", err))
}