use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, Set, DatabaseConnection};
use crate::entities::menu;

pub async fn get_all_menu_by_restaurant(db: &DatabaseConnection, id: String) -> Result<Vec<menu::Model>, String> {
    menu::Entity::find()
        .filter(menu::Column::RestaurantId.eq(id))
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn get_menu_by_id(db: &DatabaseConnection, id: String) -> Result<menu::Model, String> {
    match menu::Entity::find()
        .filter(menu::Column::MenuId.eq(id.clone()))
        .one(db)
        .await
    {
        Ok(Some(menu)) => Ok(menu),
        Ok(None) => Err(format!("No menu with such id! {}", id)),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn insert_menu(db: &DatabaseConnection, new_menu: menu::Model) -> Result<String, String> {
    let active_menu = menu::ActiveModel {
        menu_id: Set(new_menu.menu_id.clone()),
        menu_name: Set(new_menu.menu_name.clone()),
        menu_description: Set(new_menu.menu_description.clone()),
        menu_image: Set(new_menu.menu_image.clone()),
        menu_price: Set(new_menu.menu_price.clone()),
        restaurant_id: Set(new_menu.restaurant_id.clone()),
        menu_history_id: Set(new_menu.menu_history_id.clone()),
        ..Default::default()
    };

    match active_menu.insert(db).await {
        Ok(_) => Ok("Menu has been inserted successfully!".to_string()),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn get_last_menu(db: &DatabaseConnection) -> Result<Option<menu::Model>, String> {
    menu::Entity::find()
        .order_by_desc(menu::Column::MenuId)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}

pub async fn update_menu(db: &DatabaseConnection, new_menu: menu::ActiveModel) -> Result<String, String> {
    let active_model: menu::ActiveModel = new_menu.into();

    match active_model.update(db).await {
        Ok(_) => Ok("Menu updated successfully!".to_string()),
        Err(err) => Err(format!("Failed to update menu: {}", err)),
    }
}

pub async fn delete_menu_by_id(db: &DatabaseConnection, id: String) -> Result<String, String> {
    match menu::Entity::delete_many()
        .filter(menu::Column::MenuId.eq(id.clone()))
        .exec(db)
        .await
    {
        Ok(delete_result) => {
            if delete_result.rows_affected > 0 {
                Ok(format!("Menu {} deleted successfully.", id))
            } else {
                Err(format!("Menu with ID {} not found.", id))
            }
        }
        Err(err) => Err(format!("Database error: {}", err)),
    }
}

pub async fn get_all_menu_by_history_id(
    db: &DatabaseConnection,
    history_id: String,
) -> Result<Vec<menu::Model>, String> {
    menu::Entity::find()
        .filter(menu::Column::MenuHistoryId.eq(history_id))
        .all(db)
        .await
        .map_err(|err| err.to_string())
}

