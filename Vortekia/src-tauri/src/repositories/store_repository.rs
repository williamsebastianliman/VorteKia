use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, IntoActiveModel, QueryFilter, QueryOrder, Set};
use sea_orm::DatabaseConnection;
use crate::entities::store;

pub async fn get_all_stores(db: &DatabaseConnection) -> Result<Vec<store::Model>, String> {
    store::Entity::find()
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn get_store_by_id(db: &DatabaseConnection, id: String) -> Result<store::Model, String> {
    match store::Entity::find()
        .filter(store::Column::StoreId.eq(id.clone()))
        .one(db)
        .await
    {
        Ok(Some(store)) => Ok(store),
        Ok(None) => Err("No store with such id!".to_string()),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn update_store(db: &DatabaseConnection, new_store: store::ActiveModel) -> Result<String, String> {
    let active_model: store::ActiveModel = new_store.into();
    match active_model.update(db).await {
        Ok(_) => Ok("Store updated successfully!".to_string()),
        Err(err) => Err(format!("Failed to update Store: {}", err)),
    }
}

pub async fn assign_sales_associate(db: &DatabaseConnection, store_id: String, staff_id: String) -> Result<String, String> {
    let store_data = store::Entity::find()
        .filter(store::Column::StoreId.eq(store_id.clone()))
        .one(db)
        .await;

    match store_data {
        Ok(Some(store_model)) => {
            let mut active = store_model.into_active_model();
            active.staff_id = Set(Some(staff_id));
            match active.update(db).await {
                Ok(_) => Ok("Sales associate assigned successfully.".to_string()),
                Err(err) => Err(format!("Failed to update store: {}", err)),
            }
        }
        Ok(None) => Err("Store not found.".to_string()),
        Err(err) => Err(format!("Database error: {}", err)),
    }
}

pub async fn get_store_by_staff_id(db: &DatabaseConnection, staff_id: String) -> Result<store::Model, String> {
    match store::Entity::find()
        .filter(store::Column::StaffId.eq(Some(staff_id.clone())))
        .one(db)
        .await
    {
        Ok(Some(store)) => Ok(store),
        Ok(None) => Err("No store assigned to this staff.".to_string()),
        Err(err) => Err(format!("Database error: {}", err)),
    }
}

pub async fn insert_store(db: &DatabaseConnection, new_store: store::Model) -> Result<String, String> {
    let active_model = store::ActiveModel {
        store_id: Set(new_store.store_id),
        store_name: Set(new_store.store_name),
        store_description: Set(new_store.store_description),
        store_image: Set(new_store.store_image),
        store_location: Set(new_store.store_location),
        store_open_time: Set(new_store.store_open_time),
        store_close_time: Set(new_store.store_close_time),
        staff_id: Set(new_store.staff_id),
    };

    active_model
        .insert(db)
        .await
        .map(|_| "Store inserted successfully!".to_string())
        .map_err(|err| format!("Failed to insert store: {}", err))
}

pub async fn delete_store_by_id(db: &DatabaseConnection, id: String) -> Result<String, String> {
    match store::Entity::delete_many()
        .filter(store::Column::StoreId.eq(id.clone()))
        .exec(db)
        .await
    {
        Ok(result) if result.rows_affected > 0 => Ok(format!("Store {} deleted successfully!", id)),
        Ok(_) => Err(format!("No store found with id: {}", id)),
        Err(err) => Err(format!("Failed to delete store: {}", err)),
    }
}

pub async fn get_last_store(db: &DatabaseConnection) -> Result<Option<store::Model>, String> {
    store::Entity::find()
        .order_by_desc(store::Column::StoreId)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}

