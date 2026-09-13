use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, JoinType,
    QueryFilter, QuerySelect, RelationTrait, Set,
};
use crate::entities::{restaurant_order, restaurant_transaction_header};

pub async fn insert_order_by_customer(
    db: &DatabaseConnection,
    transaction_id: String,
) -> Result<String, String> {
    let active_model = restaurant_order::ActiveModel {
        transaction_id: Set(transaction_id),
        status: Set("Pending".to_string()),
        ..Default::default()
    };

    active_model
        .insert(db)
        .await
        .map(|_| "Order inserted and pending.".to_string())
        .map_err(|err| format!("Insert failed: {}", err))
}

pub async fn update_order_status_and_staff(
    db: &DatabaseConnection,
    order_id: i32,
    new_status: &str,
    staff_id: Option<String>,
) -> Result<String, String> {
    let order = restaurant_order::Entity::find()
        .filter(restaurant_order::Column::OrderId.eq(order_id))
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))?;

    match order {
        Some(order) => {
            let mut active = order.into_active_model();
            active.status = Set(new_status.to_string());

            if let Some(id) = staff_id {
                active.staff_id = Set(Some(id));
            }

            active
                .update(db)
                .await
                .map_err(|e| e.to_string())?;

            Ok("Order updated!".to_string())
        }
        None => Err("Order not found.".to_string()),
    }
}

pub async fn update_order_status(
    db: &DatabaseConnection,
    order_id: i32,
    new_status: &str,
) -> Result<String, String> {
    let order = restaurant_order::Entity::find()
        .filter(restaurant_order::Column::OrderId.eq(order_id))
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))?;

    match order {
        Some(order) => {
            let mut active = order.into_active_model();
            active.status = Set(new_status.to_string());

            active
                .update(db)
                .await
                .map_err(|e| e.to_string())?;

            Ok(format!("Order status updated to '{}'.", new_status))
        }
        None => Err("Order not found.".to_string()),
    }
}

pub async fn get_order_by_transaction_id(
    db: &DatabaseConnection,
    transaction_id: String,
) -> Result<Option<restaurant_order::Model>, String> {
    restaurant_order::Entity::find()
        .filter(restaurant_order::Column::TransactionId.eq(transaction_id))
        .one(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn get_orders_by_restaurant_and_status(
    db: &DatabaseConnection,
    restaurant_id: String,
    status: String,
) -> Result<Vec<restaurant_order::Model>, String> {
    restaurant_order::Entity::find()
        .filter(restaurant_order::Column::Status.eq(status))
        .join(
            JoinType::InnerJoin,
            restaurant_order::Relation::RestaurantTransactionHeader.def(),
        )
        .filter(restaurant_transaction_header::Column::RestaurantId.eq(restaurant_id))
        .all(db)
        .await
        .map_err(|err| format!("Failed to fetch orders: {}", err))
}

pub async fn get_orders_by_restaurant_staff_status(
    db: &DatabaseConnection,
    restaurant_id: String,
    staff_id: String,
    status: String,
) -> Result<Vec<restaurant_order::Model>, String> {
    restaurant_order::Entity::find()
        .filter(restaurant_order::Column::Status.eq(status))
        .filter(restaurant_order::Column::StaffId.eq(staff_id))
        .join(
            JoinType::InnerJoin,
            restaurant_order::Relation::RestaurantTransactionHeader.def(),
        )
        .filter(restaurant_transaction_header::Column::RestaurantId.eq(restaurant_id))
        .all(db)
        .await
        .map_err(|err| format!("Failed to fetch orders: {}", err))
}