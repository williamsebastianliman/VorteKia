use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder, Set};
use crate::entities::souvenir;

pub async fn get_all_souvenirs_by_store(db: &DatabaseConnection, id: String) -> Result<Vec<souvenir::Model>, String> {
    souvenir::Entity::find()
        .filter(souvenir::Column::StoreId.eq(id))
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn get_souvenir_by_id(db: &DatabaseConnection, id: String) -> Result<souvenir::Model, String> {
    match souvenir::Entity::find()
        .filter(souvenir::Column::SouvenirId.eq(id.clone()))
        .one(db)
        .await
    {
        Ok(Some(souvenir)) => Ok(souvenir),
        Ok(None) => Err(format!("No souvenir with such id! {}", id)),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn insert_souvenir(db: &DatabaseConnection, new_souvenir: souvenir::Model) -> Result<String, String> {
    let active_souvenir = souvenir::ActiveModel {
        souvenir_id: Set(new_souvenir.souvenir_id.clone()),
        souvenir_name: Set(new_souvenir.souvenir_name.clone()),
        souvenir_description: Set(new_souvenir.souvenir_description.clone()),
        souvenir_image: Set(new_souvenir.souvenir_image.clone()),
        souvenir_price: Set(new_souvenir.souvenir_price.clone()),
        souvenir_stock: Set(new_souvenir.souvenir_stock.clone()),
        store_id: Set(new_souvenir.store_id.clone()),
        ..Default::default()
    };

    active_souvenir
        .insert(db)
        .await
        .map(|_| "Souvenir has been inserted successfully!".to_string())
        .map_err(|err| err.to_string())
}

pub async fn get_last_souvenir(db: &DatabaseConnection) -> Result<Option<souvenir::Model>, String> {
    souvenir::Entity::find()
        .order_by_desc(souvenir::Column::SouvenirId)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}

pub async fn update_souvenir(db: &DatabaseConnection, new_souvenir: souvenir::ActiveModel) -> Result<String, String> {
    new_souvenir
        .update(db)
        .await
        .map(|_| "Souvenir updated successfully!".to_string())
        .map_err(|err| format!("Failed to update souvenir: {}", err))
}

pub async fn delete_souvenir_by_id(db: &DatabaseConnection, id: String) -> Result<String, String> {
    let result = souvenir::Entity::delete_many()
        .filter(souvenir::Column::SouvenirId.eq(id.clone()))
        .exec(db)
        .await;

    match result {
        Ok(delete_result) => {
            if delete_result.rows_affected > 0 {
                Ok(format!("Souvenir {} deleted successfully.", id))
            } else {
                Err(format!("Souvenir with ID {} not found.", id))
            }
        }
        Err(err) => Err(format!("Database error: {}", err)),
    }
}
