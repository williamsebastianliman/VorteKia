use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, Set};
use crate::entities::staff;
use sea_orm::DatabaseConnection;

pub async fn insert_staff(
    db: &DatabaseConnection,
    new_staff: staff::Model,
) -> Result<String, String> {
    let active_customer = staff::ActiveModel {
        staff_id: Set(new_staff.staff_id.clone()),
        staff_name: Set(new_staff.staff_name.clone()),
        staff_email: Set(new_staff.staff_email.clone()),
        staff_password: Set(new_staff.staff_password.clone()),
        staff_role: Set(new_staff.staff_role.clone()),
        ..Default::default()
    };

    match active_customer.insert(db).await {
        Ok(_) => Ok(format!("Staff {} inserted successfully!", new_staff.staff_id)),
        Err(err) => Err(format!("Failed to insert customer: {}", err)),
    }
}

pub async fn get_last_staff(
    db: &DatabaseConnection
) -> Result<Option<staff::Model>, String> {
    let last_staff = staff::Entity::find()
        .order_by(Expr::cust("RIGHT(staff_id, 5)"), sea_orm::Order::Desc) 
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))?;
    Ok(last_staff)
}

pub async fn get_staff_by_id(
    db: &DatabaseConnection,
    id: String
) -> Result<Option<staff::Model>, String> {
    match staff::Entity::find_by_id(id).one(db).await {
        Ok(staff) => Ok(staff),
        Err(err) => Err(format!("Database error: {}", err))
    }
}

pub async fn get_all_staff_by_role(
    db: &DatabaseConnection,
    role: String
) -> Result<Vec<staff::Model>, String> {
    match staff::Entity::find().filter(staff::Column::StaffRole.eq(role)).all(db).await {
        Ok(staffs) => Ok(staffs),
        Err(err) => Err(format!("Error: {}", err))
    }
}
