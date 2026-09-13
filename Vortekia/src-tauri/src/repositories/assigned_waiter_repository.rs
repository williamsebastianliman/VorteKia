use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, Set, DatabaseConnection};
use crate::entities::assigned_waiter;

pub async fn insert_waiter_assignment(db: &DatabaseConnection, new_assignment: assigned_waiter::Model) -> Result<String, String> {
    let existing = assigned_waiter::Entity::find()
        .filter(assigned_waiter::Column::StaffId.eq(new_assignment.staff_id.clone()))
        .one(db)
        .await
        .map_err(|err| err.to_string())?;

    if existing.is_some() {
        return Err(format!("waiter {} is already assigned to a restaurant.", new_assignment.staff_id));
    }

    let active_model = assigned_waiter::ActiveModel {
        staff_id: Set(new_assignment.staff_id.clone()),
        restaurant_id: Set(new_assignment.restaurant_id.clone()),
        description: Set(new_assignment.description.clone()),
    };

    match active_model.insert(db).await {
        Ok(_) => Ok("waiter assignment inserted successfully.".to_string()),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn update_waiter_assignment(db: &DatabaseConnection, updated_assignment: assigned_waiter::ActiveModel) -> Result<String, String> {
    match updated_assignment.update(db).await {
        Ok(_) => Ok("waiter assignment updated successfully.".to_string()),
        Err(err) => Err(format!("Failed to update waiter assignment: {}", err)),
    }
}

pub async fn get_assignment_by_staff(db: &DatabaseConnection, staff_id: String) -> Result<Option<assigned_waiter::Model>, String> {
    assigned_waiter::Entity::find()
        .filter(assigned_waiter::Column::StaffId.eq(staff_id))
        .one(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn delete_assignment_by_staff(db: &DatabaseConnection, staff_id: String) -> Result<String, String> {
    match assigned_waiter::Entity::delete_many()
        .filter(assigned_waiter::Column::StaffId.eq(staff_id.clone()))
        .exec(db)
        .await
    {
        Ok(result) if result.rows_affected > 0 => Ok("waiter assignment deleted successfully.".to_string()),
        Ok(_) => Err(format!("No assignment found for waiter {}", staff_id)),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn get_waiters_by_restaurant(db: &DatabaseConnection, restaurant_id: String) -> Result<Vec<assigned_waiter::Model>, String> {
    assigned_waiter::Entity::find()
        .filter(assigned_waiter::Column::RestaurantId.eq(restaurant_id))
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn count_waiter_by_restaurant_id(db: &DatabaseConnection, restaurant_id: String) -> Result<u32, String> {
    assigned_waiter::Entity::find()
        .filter(assigned_waiter::Column::RestaurantId.eq(restaurant_id))
        .count(db)
        .await
        .map(|count| count as u32)
        .map_err(|err| err.to_string())
}
