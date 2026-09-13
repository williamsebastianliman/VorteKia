pub use sea_orm_migration::prelude::*;

mod m20250226_045228_create_Staff;
mod m20250226_045239_create_Customer;
mod m20250228_070940_create_Itemlog;
mod m20250301_064903_create_Store;
mod m20250301_064913_create_Souvenir;
mod m20250303_052255_create_Restaurant;
mod m20250303_060127_create_Menu;
mod m20250304_033722_create_RestaurantTransactionHeader;
mod m20250301_034840_create_MenuHistory;
mod m20250304_035118_create_RestaurantTransactionDetail;
mod m20250305_053302_create_NewRestaurantProposal;
mod m20250305_060141_create_RideRemovalProposal;
mod m20250305_060749_create_AssignedRideStaff;
mod m20250305_060808_create_AssignedChef;
mod m20250305_060812_create_AssignedWaiter;
mod m20250304_061001_create_Ride;
mod m20250305_061507_create_RideQueue;
mod m20250305_065223_create_NewRideProposal;
mod m20250307_033957_create_MaintenanceTask;
mod m20250307_034043_create_MaintenanceReport;
mod m20250328_082440_create_GroupChat;
mod m20250329_082428_create_Chat;
mod m20250401_055059_create_OfficialAccount;
mod m20250401_055454_create_ChatOA;
mod m20250401_055545_create_CustomerInquiries;
mod m20250401_055641_create_Broadcast;
mod m20250401_061519_create_MaintenanceRequest;
mod m20250401_092822_create_Notification;
mod m20250401_093149_create_inquiries_Response;
mod m20250403_035201_create_NewStoreProposal;
mod m20250403_035316_create_StoreRemovalProposal;
mod m20250403_041054_create_RestaurantOrder;
mod m20250403_041105_create_RideTransaction;
mod m20250403_041117_create_StoreTransactionHeader;
mod m20250403_041124_create_StoreTransactionDetail;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250226_045228_create_Staff::Migration),
            Box::new(m20250226_045239_create_Customer::Migration),
            Box::new(m20250228_070940_create_Itemlog::Migration),
            Box::new(m20250301_064903_create_Store::Migration),
            Box::new(m20250301_064913_create_Souvenir::Migration),
            Box::new(m20250303_052255_create_Restaurant::Migration),
            Box::new(m20250304_061001_create_Ride::Migration),
            
            Box::new(m20250304_033722_create_RestaurantTransactionHeader::Migration),
            Box::new(m20250301_034840_create_MenuHistory::Migration),
            Box::new(m20250303_060127_create_Menu::Migration),
            Box::new(m20250304_035118_create_RestaurantTransactionDetail::Migration),
            Box::new(m20250305_053302_create_NewRestaurantProposal::Migration),
            Box::new(m20250305_060141_create_RideRemovalProposal::Migration),
            Box::new(m20250305_060749_create_AssignedRideStaff::Migration),
            Box::new(m20250305_060808_create_AssignedChef::Migration),
            Box::new(m20250305_060812_create_AssignedWaiter::Migration),
            
            Box::new(m20250305_061507_create_RideQueue::Migration),
            Box::new(m20250305_065223_create_NewRideProposal::Migration),
            Box::new(m20250307_033957_create_MaintenanceTask::Migration),
            Box::new(m20250307_034043_create_MaintenanceReport::Migration),
            Box::new(m20250328_082440_create_GroupChat::Migration),
            Box::new(m20250329_082428_create_Chat::Migration),
            Box::new(m20250401_055059_create_OfficialAccount::Migration),
            Box::new(m20250401_055454_create_ChatOA::Migration),
            Box::new(m20250401_055545_create_CustomerInquiries::Migration),
            Box::new(m20250401_055641_create_Broadcast::Migration),
            Box::new(m20250401_061519_create_MaintenanceRequest::Migration),
            Box::new(m20250401_092822_create_Notification::Migration),
            Box::new(m20250401_093149_create_inquiries_Response::Migration),
            Box::new(m20250403_035201_create_NewStoreProposal::Migration),
            Box::new(m20250403_035316_create_StoreRemovalProposal::Migration),
            Box::new(m20250403_041054_create_RestaurantOrder::Migration),
            Box::new(m20250403_041105_create_RideTransaction::Migration),
            Box::new(m20250403_041117_create_StoreTransactionHeader::Migration),
            Box::new(m20250403_041124_create_StoreTransactionDetail::Migration),
        ]
    }
}
