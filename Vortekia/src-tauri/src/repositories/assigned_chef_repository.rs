use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, PaginatorTrait, QueryFilter, Set
};
use crate::entities::assigned_chef;

pub async fn insert_chef_assignment(
    db: &DatabaseConnection,
    new_assignment: assigned_chef::Model,
) -> Result<String, String> {
    let existing = assigned_chef::Entity::find()
        .filter(assigned_chef::Column::StaffId.eq(new_assignment.staff_id.clone()))
        .one(db)
        .await
        .map_err(|err| err.to_string())?;

    if existing.is_some() {
        return Err(format!(
            "Chef {} is already assigned to a restaurant.",
            new_assignment.staff_id
        ));
    }

    let active_model = assigned_chef::ActiveModel {
        staff_id: Set(new_assignment.staff_id.clone()),
        restaurant_id: Set(new_assignment.restaurant_id.clone()),
        description: Set(new_assignment.description.clone()),
    };

    match active_model.insert(db).await {
        Ok(_) => Ok("Chef assignment inserted successfully!".to_string()),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn update_chef_assignment(
    db: &DatabaseConnection,
    updated_assignment: assigned_chef::ActiveModel,
) -> Result<String, String> {
    match updated_assignment.update(db).await {
        Ok(_) => Ok("Chef assignment updated successfully!".to_string()),
        Err(err) => Err(format!("Failed to update chef assignment: {}", err)),
    }
}

// Retrieves an assignment by a chef's staff ID.
pub async fn get_assignment_by_staff(
    db: &DatabaseConnection,
    staff_id: String,
) -> Result<Option<assigned_chef::Model>, String> {
    assigned_chef::Entity::find()
        .filter(assigned_chef::Column::StaffId.eq(staff_id))
        .one(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn delete_assignment_by_staff(
    db: &DatabaseConnection,
    staff_id: String,
) -> Result<String, String> {
    match assigned_chef::Entity::delete_many()
        .filter(assigned_chef::Column::StaffId.eq(staff_id.clone()))
        .exec(db)
        .await
    {
        Ok(result) => {
            if result.rows_affected > 0 {
                Ok("Chef assignment deleted successfully.".to_string())
            } else {
                Err(format!("No assignment found for chef {}", staff_id))
            }
        }
        Err(err) => Err(err.to_string()),
    }
}

pub async fn get_chefs_by_restaurant(
    db: &DatabaseConnection,
    restaurant_id: String,
) -> Result<Vec<assigned_chef::Model>, String> {
    assigned_chef::Entity::find()
        .filter(assigned_chef::Column::RestaurantId.eq(restaurant_id))
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn count_chefs_by_restaurant_id(
    db: &DatabaseConnection,
    restaurant_id: String,
) -> Result<u32, String> {
    assigned_chef::Entity::find()
        .filter(assigned_chef::Column::RestaurantId.eq(restaurant_id))
        .count(db)
        .await
        .map(|count| count as u32)
        .map_err(|e| e.to_string())
}
