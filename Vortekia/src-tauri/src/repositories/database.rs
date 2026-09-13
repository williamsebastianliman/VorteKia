use sea_orm::Database;
use sea_orm::DatabaseConnection;
use std::sync::OnceLock;
use tokio::sync::Mutex;

static DB: OnceLock<DatabaseConnection> = OnceLock::new();
static INIT_MUTEX: Mutex<()> = Mutex::const_new(());

pub async fn get_db() -> &'static DatabaseConnection {
    if DB.get().is_none() {
        let _guard = INIT_MUTEX.lock().await;
        if DB.get().is_none() {
            let database_url = "mysql://root:@localhost:3306/vortekia";
            let db = Database::connect(database_url)
                .await
                .expect("Failed to connect to DB");
            DB.set(db).expect("Database already initialized");
        }
    }
    DB.get().expect("Database is not initialized")
}
