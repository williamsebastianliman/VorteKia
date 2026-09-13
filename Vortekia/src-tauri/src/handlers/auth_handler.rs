use crate::repositories::customer_repository;
use crate::{entities::staff, repositories::staff_repository};
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use crate::modules::login_response::LoginResponse;
use crate::state::AppState;
use sea_orm::DatabaseConnection;

pub async fn role_to_url(role: String, id: String) -> String {
    match role.as_str() {
        "CS" => "/staff/cs/registercustomer".to_string(),
        "COO" => "/staff/coo/registerstaff".to_string(),
        "LNFS" => "/staff/lnf/viewlog".to_string(),
        "RS" => "/staff/rs/viewqueue".to_string(),
        "MM" => "/staff/camm/viewmaintenancetask".to_string(),
        "MS" => "/staff/cnms/groupchat".to_string(),
        "RDM" => "/staff/rdm/groupchat/".to_string(),
        "RM" => "/staff/rm/viewstores".to_string(),
        "FNBM" => "/staff/fnbm/viewrestaurants".to_string(),
        "CF" => "/staff/cf/groupchat".to_string(),
        "WT" => "/staff/wt/groupchat".to_string(),
        "SA" => "/staff/sa/groupchat".to_string(),
        "CEO" => "/staff/ceo/groupchat".to_string(),
        "CFO" => "/staff/cfo/groupchat".to_string(),
        _ => "error/unknownrole".to_string(),
    }
}

pub async fn staff_login(
    id: String,
    password: String,
    state: tauri::State<'_, AppState>,
) -> Result<LoginResponse, String> {
    let db = &state.db;
    let staff_opt = staff_repository::get_staff_by_id(db, id.clone()).await.ok().flatten();

    if let Some(staff_member) = staff_opt {
        let argon2 = Argon2::default();
        if let Ok(parsed_hash) = PasswordHash::new(&staff_member.staff_password) {
            if argon2.verify_password(password.as_bytes(), &parsed_hash).is_ok() {
                let redirect = role_to_url(staff_member.staff_role.clone(), staff_member.staff_id.clone()).await;
                let mut sessions = state.sessions.lock().unwrap();
                sessions.insert("staff_id".to_string(), id.clone());
                return Ok(LoginResponse {
                    message: "Login Successful".to_string(),
                    redirect_url: redirect,
                });
            }
        }
    }

    Err("Invalid credentials".to_string())
}

pub async fn customer_login(
    id: String,
    state: tauri::State<'_, AppState>,
) -> Result<String, String> {
    let db = &state.db;
    let customer = customer_repository::get_customer_by_id(db, id.clone()).await.ok();

    if let Some(customer1) = customer {
        if customer1.customer_id == id.clone() {
            let mut sessions = state.sessions.lock().unwrap();
            sessions.insert("customer_id".to_string(), id.clone());
            return Ok("Successfull Login!".to_string());
        }
        return Err("Invalid Credential".to_string());
    }

    Err("Customer ID Not Found!".to_string())
}

