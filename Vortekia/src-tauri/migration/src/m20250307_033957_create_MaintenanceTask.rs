use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

pub fn pk(col: impl IntoIden) -> ColumnDef {
    ColumnDef::new(col).string_len(5).not_null().primary_key().to_owned()
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .create_table(
                Table::create()
                    .table(MaintenanceTask::Table)
                    .if_not_exists()
                    .col(pk(MaintenanceTask::TaskID))
                    .col(string(MaintenanceTask::TaskName))
                    .col(string(MaintenanceTask::TaskDescription))
                    .col(string(MaintenanceTask::Status))
                    .col(string(MaintenanceTask::RideID)) 
                    .col(
                        ColumnDef::new(MaintenanceTask::MaintenanceStart)
                            .date_time() 
                            .not_null() 
                            .default(Expr::current_timestamp())
                            .to_owned(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(MaintenanceTask::Table, MaintenanceTask::RideID)
                            .to(Ride::Table, Ride::RideID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(string(MaintenanceTask::StaffID))
                    .foreign_key(
                        ForeignKey::create()
                            .from(MaintenanceTask::Table, MaintenanceTask::StaffID)
                            .to(Staff::Table, Staff::StaffID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(MaintenanceTask::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum MaintenanceTask {
    Table,
    TaskID,
    TaskName,
    TaskDescription,
    MaintenanceStart,
    Status,
    RideID,
    StaffID,
}
#[derive(DeriveIden)]
enum Ride
{
    Table,
    RideID,
}
#[derive(DeriveIden)]
enum Staff
{
    Table,
    StaffID,
}

