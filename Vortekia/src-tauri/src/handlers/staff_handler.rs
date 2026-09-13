use crate::repositories::staff_repository;
use crate::entities::staff;
use argon2::{Argon2, PasswordHasher, password_hash::{SaltString, rand_core::OsRng}};
use chrono::{Utc, Datelike};
use rand::Rng;
use sea_orm::DatabaseConnection;

pub async fn generate_staff_id(db: &DatabaseConnection) -> String {
    let last_staff = staff_repository::get_last_staff(db).await.ok().flatten();
    let year = Utc::now().year() % 100;
    let random_number = rand::thread_rng().gen_range(100..=999);

    match last_staff {
        Some(staff) => {
            let last_id = &staff.staff_id;
            if let Some(num_part) = last_id.strip_prefix("ST") {
                if num_part.len() >= 10 {
                    let last_num = num_part[5..].parse::<u32>().unwrap_or(0);
                    format!("ST{}{}{:05}", year, random_number, last_num + 1)
                } else {
                    format!("ST{}{}00001", year, random_number)
                }
            } else {
                format!("ST{}{}00001", year, random_number)
            }
        }
        None => format!("ST{}{}00001", year, random_number),
    }
}

pub async fn insert_staff(
    db: &DatabaseConnection,
    name: String,
    email: String,
    password: String,
    role: String,
) -> Result<String, String> {
    let new_id = generate_staff_id(db).await;

    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let hashed_password = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|err| format!("Error hashing password: {}", err))?
        .to_string();

    let new_staff = staff::Model {
        staff_id: new_id,
        staff_name: name,
        staff_email: email,
        staff_password: hashed_password,
        staff_role: role,
    };

    staff_repository::insert_staff(db, new_staff).await
}

pub async fn get_staff_by_role(
    db: &DatabaseConnection,
    role: String,
) -> Result<Vec<staff::Model>, String> {
    staff_repository::get_all_staff_by_role(db, role).await
}

pub async fn get_staff_by_id(
    db: &DatabaseConnection,
    id: String,
) -> Result<staff::Model, String> {
    match staff_repository::get_staff_by_id(db, id).await {
        Ok(Some(staff)) => Ok(staff),
        Ok(None) => Err("ID Not Found".to_string()),
        Err(err) => Err(err),
    }
}
