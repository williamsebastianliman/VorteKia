use chrono::{Local, Timelike};
use sea_orm::DatabaseConnection;
use crate::{entities::assigned_ride_staff, repositories::assigned_ride_staff_repository};

pub async fn insert_schedule(
    db: &DatabaseConnection,
    staffs: Vec<Option<String>>,
    ride_id: String,
) -> Result<String, String> {
    for (idx, staff) in staffs.iter().enumerate() {
        let idx = idx + 1;
        match assigned_ride_staff_repository::get_schedule_by_key(db, ride_id.clone(), idx as i32).await {
            Ok(Some(schedule)) => {
                if let Some(_) = staff {
                    match assigned_ride_staff_repository::get_staff_availibility(db, staff.clone().unwrap(), idx as i32).await {
                        Ok(_) => {},
                        Err(err) => {
                            if ride_id.clone() != err {
                                return Err(format!("Staff Already Assigned At Ride: {}", err));
                            } else {
                                continue;
                            }
                        },
                    }
                    let existing_schedule = schedule;
                    let mut active_model: assigned_ride_staff::ActiveModel = existing_schedule.into();
                    active_model.staff_id = sea_orm::ActiveValue::Set(staff.clone().unwrap());
                    match assigned_ride_staff_repository::update_schedule(db, active_model).await {
                        Ok(_) => {},
                        Err(err) => return Err(err),
                    }
                } else {
                    let existing_schedule = schedule;
                    match assigned_ride_staff_repository::delete_schedule_by_key(db, existing_schedule.ride_id, existing_schedule.shift).await {
                        Ok(_) => {},
                        Err(err) => return Err(err),
                    }
                }
            }
            Ok(None) => {
                if let Some(_) = staff {
                    match assigned_ride_staff_repository::get_staff_availibility(db, staff.clone().unwrap(), idx as i32).await {
                        Ok(_) => {},
                        Err(err) => return Err(err),
                    }
                    let new_schedule: assigned_ride_staff::Model = assigned_ride_staff::Model {
                        ride_id: ride_id.clone(),
                        staff_id: staff.clone().unwrap(),
                        shift: idx as i32,
                    };
                    match assigned_ride_staff_repository::insert_schedule(db, new_schedule).await {
                        Ok(_) => {},
                        Err(err) => return Err(format!("{}", err)),
                    }
                }
            }
            Err(err) => return Err(err),
        }
    }
    Ok("Sucessfully Inserting All Schedule!".to_string())
}

pub async fn load_schedule_by_ride(
    db: &DatabaseConnection,
    ride_id: String,
) -> Result<Vec<Option<assigned_ride_staff::Model>>, String> {
    let mut schedule_list = Vec::new();
    for shift in 1..=6 {
        match assigned_ride_staff_repository::get_schedule_by_key(db, ride_id.clone(), shift).await {
            Ok(Some(schedule)) => {
                schedule_list.push(Some(schedule));
            }
            Ok(None) => {
                schedule_list.push(None);
            }
            Err(err) => {
                return Err(err);
            }
        }
    }
    Ok(schedule_list)
}

pub async fn is_staff_available(
    db: &DatabaseConnection,
    id: String,
    shift: i32,
) -> Result<String, String> {
    assigned_ride_staff_repository::get_staff_availibility(db, id, shift).await
}

pub async fn get_ride_by_schedule(
    db: &DatabaseConnection,
    id: String,
) -> Result<String, String> {
    let utc_now = Local::now();
    let hour = utc_now.hour();
    let shift = match hour {
        0..=8 => 1,
        9..=10 => 2,
        11..=12 => 3,
        13..=14 => 4,
        15..=16 => 5,
        17..=24 => 6,
        _ => return Err("No active shift at this time".to_string()),
    };
    match assigned_ride_staff_repository::get_ride_by_schedule(db, id.clone(), shift).await {
        Ok(Some(schedule)) => Ok(schedule.ride_id),
        Ok(None) => Ok("None".to_string()),
        Err(err) => Err(format!("{}", err)),
    }
}
