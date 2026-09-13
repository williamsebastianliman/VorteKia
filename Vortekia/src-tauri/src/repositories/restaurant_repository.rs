use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};
use crate::entities::restaurant;

pub async fn get_all_restaurants(db: &DatabaseConnection) -> Result<Vec<restaurant::Model>, String> {
    restaurant::Entity::find()
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn get_restaurant_by_id(db: &DatabaseConnection, id: String) -> Result<restaurant::Model, String> {
    match restaurant::Entity::find()
        .filter(restaurant::Column::RestaurantId.eq(id.clone()))
        .one(db)
        .await
    {
        Ok(Some(restaurant)) => Ok(restaurant),
        Ok(None) => Err("No restaurant with such id!".to_string()),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn update_restaurant(db: &DatabaseConnection, new_restaurant: restaurant::ActiveModel) -> Result<String, String> {
    let active_model: restaurant::ActiveModel = new_restaurant.into();
    active_model
        .update(db)
        .await
        .map(|_| "Restaurant updated successfully!".to_string())
        .map_err(|err| format!("Failed to update Restaurant: {}", err))
}

pub async fn delete_restaurant_by_id(db: &DatabaseConnection, id: String) -> Result<String, String> {
    let delete_result = restaurant::Entity::delete_many()
        .filter(restaurant::Column::RestaurantId.eq(id.clone()))
        .exec(db)
        .await;

    match delete_result {
        Ok(result) => {
            if result.rows_affected > 0 {
                Ok(format!("Restaurant {} deleted successfully.", id))
            } else {
                Err(format!("Restaurant with ID {} not found.", id))
            }
        }
        Err(err) => Err(format!("Database error: {}", err)),
    }
}

pub async fn insert_restaurant(db: &DatabaseConnection, new_restaurant: restaurant::Model) -> Result<String, String> {
    let active_model = restaurant::ActiveModel {
        restaurant_id: sea_orm::ActiveValue::Set(new_restaurant.restaurant_id),
        restaurant_name: sea_orm::ActiveValue::Set(new_restaurant.restaurant_name),
        restaurant_description: sea_orm::ActiveValue::Set(new_restaurant.restaurant_description),
        restaurant_image: sea_orm::ActiveValue::Set(new_restaurant.restaurant_image),
        restaurant_open_time: sea_orm::ActiveValue::Set(new_restaurant.restaurant_open_time),
        restaurant_close_time: sea_orm::ActiveValue::Set(new_restaurant.restaurant_close_time),
        ..Default::default()
    };

    active_model
        .insert(db)
        .await
        .map(|_| "Restaurant inserted successfully!".to_string())
        .map_err(|err| format!("Failed to insert restaurant: {}", err))
}

pub async fn get_last_restaurant(db: &DatabaseConnection) -> Result<Option<restaurant::Model>, String> {
    restaurant::Entity::find()
        .order_by_desc(restaurant::Column::RestaurantId)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}
