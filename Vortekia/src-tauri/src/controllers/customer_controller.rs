use crate::{entities::customer, handlers::customer_handler, repositories::customer_repository, state::AppState}; 
use tauri::{command, State};

#[command]
pub async fn register_new_customer(
    state: State<'_, AppState>,
    name: String,
    email: String,
    phone: String
) -> Result<String, String> {
    if name.trim().is_empty() || email.trim().is_empty() || phone.trim().is_empty() {
        return Err("All Field Must Be Filled!".to_string());
    }
    if !email.contains("@") {
        return Err("Email must contain @".to_string());
    }
    if !phone.chars().all(|c| c.is_digit(10)) {
        return Err("Phone Number Must be Numeric!".to_string());
    }

    let db = &state.db;
    customer_handler::insert_customer(db, name, email, phone).await
}

#[command]
pub async fn get_customers_by_name_prefix(
    state: State<'_, AppState>,
    prefix: String
) -> Result<Vec<customer::Model>, String> {
    let db = &state.db;
    customer_handler::get_customers_by_name_prefix(db, prefix).await
}

#[command]
pub async fn update_customer_balance(
    state: State<'_, AppState>,
    customer_id: String,
    new_balance: i32
) -> Result<String, String> {
    let db = &state.db;

    let customer = match customer_handler::get_customer_by_id(db, customer_id.clone()).await {
        Ok(cust) => cust,
        Err(err) => return Err(format!("Customer not found: {}", err)),
    };

    let total_balance = customer.customer_balance + new_balance;
    customer_repository::update_customer_balance_by_id(db, customer_id, total_balance).await
}

#[command]
pub async fn deduct_customer_balance(
    state: State<'_, AppState>,
    customer_id: String,
    amount: i32
) -> Result<String, String> {
    if amount <= 0 {
        return Err("Deduction amount must be greater than 0".to_string());
    }

    let db = &state.db;
    let customer = match customer_handler::get_customer_by_id(db, customer_id.clone()).await {
        Ok(cust) => cust,
        Err(err) => return Err(format!("Customer not found: {}", err)),
    };

    if customer.customer_balance < amount {
        return Err(format!(
            "Insufficient balance. Current: {}, Required: {}",
            customer.customer_balance, amount
        ));
    }

    let remaining_balance = customer.customer_balance - amount;
    customer_repository::update_customer_balance_by_id(db, customer_id, remaining_balance).await
}

#[command]
pub async fn get_customer_by_id(
    state: State<'_, AppState>,
    id: String
) -> Result<customer::Model, String> {
    let db = &state.db;
    customer_repository::get_customer_by_id(db, id).await
}
