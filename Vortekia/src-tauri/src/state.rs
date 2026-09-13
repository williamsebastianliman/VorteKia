use sea_orm::DatabaseConnection;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct AppState {
    pub sessions: Arc<Mutex<HashMap<String, String>>>,
    pub db: DatabaseConnection,
}
