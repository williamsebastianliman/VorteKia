use sea_orm::DatabaseConnection;
use crate::{entities::menu_history, repositories::menu_history_repository};

pub async fn generate_menu_history_id(db: &DatabaseConnection) -> String {
    let last_menu = menu_history_repository::get_last_menu_history(db).await.ok().flatten();
    match last_menu {
        Some(menu) => {
            let last_id = &menu.menu_history_id;
            if let Some(num) = last_id.strip_prefix("MH") {
                let last_num: u32 = num.parse::<u32>().unwrap_or(0);
                format!("MH{:03}", last_num + 1)
            } else {
                format!("MH001")
            }
        }
        None => format!("MH001"),
    }
}

pub async fn insert_menu_history(
    db: &DatabaseConnection,
    name: String,
    price: i32,
) -> Result<String, String> {
    let new_id = generate_menu_history_id(db).await;
    let new_menu_history = menu_history::Model {
        menu_history_id: new_id.clone(),
        menu_history_name: name,
        menu_history_price: price,
    };
    menu_history_repository::insert_menu_history(db, new_menu_history)
        .await
        .map(|_| new_id)
}

pub async fn get_menu_history(
    db: &DatabaseConnection,
    id: String,
) -> Result<menu_history::Model, String> {
    match menu_history_repository::get_menu_history(db, id).await {
        Ok(Some(menu_history)) => Ok(menu_history),
        Ok(None) => Err("Menu History Not Found!".to_string()),
        Err(err) => Err(err),
    }
}
