use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, Set, DatabaseConnection};
use crate::entities::menu_history;

pub async fn insert_menu_history(db: &DatabaseConnection, new_menu_history: menu_history::Model) -> Result<String, String> {
    let active_menu = menu_history::ActiveModel {
        menu_history_id: Set(new_menu_history.menu_history_id.clone()),
        menu_history_name: Set(new_menu_history.menu_history_name.clone()),
        menu_history_price: Set(new_menu_history.menu_history_price.clone()),
        ..Default::default()
    };

    match active_menu.insert(db).await {
        Ok(_) => Ok("Menu has been inserted successfully!".to_string()),
        Err(err) => Err(err.to_string()),
    }
}

pub async fn get_menu_history(db: &DatabaseConnection, id: String) -> Result<Option<menu_history::Model>, String> {
    menu_history::Entity::find()
        .filter(menu_history::Column::MenuHistoryId.eq(id))
        .one(db)
        .await
        .map_err(|err| err.to_string())
}

pub async fn get_last_menu_history(db: &DatabaseConnection) -> Result<Option<menu_history::Model>, String> {
    menu_history::Entity::find()
        .order_by_desc(menu_history::Column::MenuHistoryId)
        .one(db)
        .await
        .map_err(|err| format!("Database error: {}", err))
}
