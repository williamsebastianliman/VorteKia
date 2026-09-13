mod entities;
mod repositories;
mod modules;
mod handlers;
mod controllers;
mod state;

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use controllers::customer_controller::{register_new_customer, update_customer_balance, deduct_customer_balance, get_customers_by_name_prefix, get_customer_by_id};
use controllers::staff_controller::{register_new_staff, get_staff_by_role, get_staff_by_id};
use controllers::auth_controller::{staff_login, customer_login, check_customer_login, customer_logout, get_logged_in_customer, check_staff_login, get_logged_in_staff};
use controllers::item_log_controller::{insert_new_itemlog, get_all_itemlogs, delete_itemlog_by_id, update_itemlog_by_id, update_itemlog_all_by_id, get_itemlog_by_id};
use controllers::store_controller::{get_all_stores, get_store_by_id, update_store_by_id, assign_sales_associate, get_store_by_staff_id, is_store_open, insert_store, delete_store_by_id};
use controllers::souvenir_controller::{get_all_souvenirs_by_store, insert_souvenir, update_souvenir_by_id, delete_souvenir_by_id, get_souvenir_by_id};
use controllers::restaurant_controller::{get_all_restaurants, get_restaurant_by_id, update_restaurant_by_id, is_restaurant_open, insert_restaurant, delete_restaurant_by_id};
use controllers::menu_controller::{get_all_menu_by_restaurant, insert_menu, update_menu_by_id, delete_menu_by_id, get_menu_by_id, get_all_menu_by_history_id};
use controllers::menu_history_controller::{get_menu_history, insert_menu_history};
use controllers::restaurant_transaction_controller::{insert_new_transaction, get_restaurant_transaction_detail_by_header};
use controllers::ride_controller::{get_all_rides, get_ride_by_id, update_ride_by_id, is_ride_open, insert_ride, delete_ride_by_id};
use controllers::assigned_ride_staff_controller::{insert_ride_schedule, get_assigned_staff_by_ride, is_staff_available, get_ride_by_schedule};
use controllers::maintenance_task_controller::{insert_new_maintenance_task, get_all_maintenance_task_by_staff, is_staff_inactive, update_maintenance_task_by_id, get_all_maintenance_task, get_maintenance_task_by_id, delete_maintenance_task_by_id, update_maintenance_task_status_by_id, is_ride_not_under_maintenance};
use controllers::ride_queue_controller::{get_queue_by_ride, get_queue_by_staff, delete_queue_by_key, insert_queue_by_customer, update_queue};
use controllers::ride_removal_proposal_controller::{insert_ride_removal_proposal, view_all_ride_removal_proposals, delete_ride_removal_proposal_by_id};
use controllers::new_ride_proposal_controller::{insert_new_ride_proposal, delete_new_ride_proposal_by_id, view_all_ride_proposals};
use controllers::maintenance_report_controller::{insert_new_maintenance_report, get_all_maintenance_report_by_staff, is_staff_inactive_report, update_maintenance_report_by_id, get_all_maintenance_report, update_maintenance_report_status_by_id, get_maintenance_report_by_id};
use controllers::chat_controller::{insert_new_chat, get_all_chats_by_group};
use controllers::chat_oa_controller::{insert_new_chat_oa, get_all_chat_oa_by_group, get_all_chat_oa_by_real_group};
use controllers::customer_inquiries_controller::{insert_customer_inquiries, get_all_customer_inquiries_by_group, get_all_customers_inquired};
use controllers::broadcast_controller::{insert_broadcast, get_all_broadcast_by_type};
use controllers::inquiries_response_controller::{insert_inquries_response, get_all_inquries_response_by_customer};
use controllers::assigned_chef_controller::{insert_chef_assignment, delete_chef_assignment, update_chef_assignment, get_chef_assignment_by_staff, get_chefs_by_restaurant, count_chefs_by_restaurant_id};
use controllers::assigned_waiter_controller::{insert_waiter_assignment, delete_waiter_assignment, update_waiter_assignment, get_waiter_assignment_by_staff, get_waiters_by_restaurant, count_waiter_by_restaurant_id};
use controllers::new_restaurant_proposal_controller::{insert_new_restaurant_proposal, delete_new_restaurant_proposal_by_id, view_all_restaurant_proposals};
use controllers::restaurant_order_controller::{insert_order_by_customer, update_order_status_and_staff, update_order_status, get_order_by_transaction_id, get_orders_by_restaurant_and_status, get_orders_by_restaurant_staff_status};
use controllers::new_store_proposal_controller::{insert_new_store_proposal, view_all_store_proposals, get_last_new_store_proposal, delete_new_store_proposal_by_id};
use controllers::store_removal_proposal_controller::{insert_store_removal_proposal, get_all_store_removal_proposals, delete_store_removal_proposal_by_id};
use controllers::store_transaction_controller::{insert_new_transaction_store, get_store_transactions_with_details, get_store_transaction_detail_by_header};
use controllers::notification_controller::{insert_notification, get_all_notifications_by_customer};
use controllers::entry_point_controller::get_app_id_command;

use state::AppState;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_connection = {
        let rt = tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime");
        rt.block_on(async {
            let database_url = "mysql://root:@localhost:3306/vortekia";
            sea_orm::Database::connect(database_url)
                .await
                .expect("Failed to connect to DB")
        })
    };
    let app_state = AppState {
        sessions: Arc::new(Mutex::new(HashMap::new())),
        db: db_connection,
    };

    tauri::Builder::default()
        .manage(app_state)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![register_new_customer, register_new_staff, staff_login, get_customers_by_name_prefix, 
            insert_new_itemlog, get_all_itemlogs, delete_itemlog_by_id, update_itemlog_by_id, get_all_stores, get_store_by_id, update_store_by_id, insert_souvenir, 
            get_all_souvenirs_by_store, update_souvenir_by_id, delete_souvenir_by_id, get_souvenir_by_id,
            get_all_restaurants, get_restaurant_by_id, update_restaurant_by_id, get_all_menu_by_restaurant, insert_menu, update_menu_by_id,
            delete_menu_by_id, get_menu_by_id, get_menu_history, insert_menu_history, insert_new_transaction, customer_login,
            check_customer_login,customer_logout, get_all_rides, get_restaurant_by_id, update_ride_by_id, get_ride_by_id,
            get_staff_by_role, insert_ride_schedule, get_assigned_staff_by_ride, get_staff_by_id, is_staff_available, insert_new_maintenance_task,
            get_queue_by_ride, get_ride_by_schedule, get_queue_by_staff, delete_queue_by_key, insert_ride_removal_proposal, insert_new_ride_proposal, get_all_maintenance_task_by_staff,
            is_staff_inactive, update_maintenance_task_by_id, insert_new_maintenance_report, get_all_maintenance_report_by_staff, is_staff_inactive_report, update_maintenance_report_by_id,
            get_all_maintenance_report, get_all_maintenance_task, update_maintenance_report_status_by_id, get_maintenance_task_by_id, get_maintenance_report_by_id,
            delete_maintenance_task_by_id, update_maintenance_task_status_by_id, insert_new_chat, get_all_chats_by_group, check_staff_login, get_logged_in_customer, get_logged_in_staff,
            insert_new_chat_oa, get_all_chat_oa_by_group, insert_customer_inquiries, get_all_customer_inquiries_by_group, insert_broadcast, get_all_broadcast_by_type, 
            update_customer_balance, insert_inquries_response, get_all_inquries_response_by_customer, get_all_customers_inquired, get_all_chat_oa_by_real_group, insert_chef_assignment,
            delete_chef_assignment, update_chef_assignment, get_chef_assignment_by_staff, get_chefs_by_restaurant, insert_waiter_assignment, delete_waiter_assignment,
            update_waiter_assignment, get_waiter_assignment_by_staff, get_waiters_by_restaurant, count_chefs_by_restaurant_id, count_waiter_by_restaurant_id, is_restaurant_open,
            insert_new_restaurant_proposal, get_customer_by_id, insert_queue_by_customer, update_queue, is_ride_open, deduct_customer_balance,
            insert_order_by_customer, update_order_status_and_staff, update_order_status, get_order_by_transaction_id, get_orders_by_restaurant_and_status, get_orders_by_restaurant_staff_status,
            insert_new_store_proposal, view_all_store_proposals, get_last_new_store_proposal, insert_store_removal_proposal, get_all_store_removal_proposals, assign_sales_associate,
            get_store_by_staff_id, is_store_open, insert_new_transaction_store, is_ride_not_under_maintenance, insert_store, delete_store_by_id, insert_restaurant, delete_restaurant_by_id,
            insert_ride, delete_ride_by_id, view_all_ride_removal_proposals, delete_ride_removal_proposal_by_id, delete_new_restaurant_proposal_by_id, delete_new_ride_proposal_by_id, delete_new_store_proposal_by_id, delete_store_removal_proposal_by_id,
            view_all_ride_proposals, view_all_restaurant_proposals, get_store_transactions_with_details, get_store_transaction_detail_by_header, get_app_id_command, update_itemlog_all_by_id, get_itemlog_by_id,
            insert_notification, get_all_notifications_by_customer, get_restaurant_transaction_detail_by_header,get_all_menu_by_history_id])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}