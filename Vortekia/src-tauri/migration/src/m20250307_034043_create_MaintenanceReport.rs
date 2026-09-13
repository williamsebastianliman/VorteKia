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
                    .table(MaintenanceReport::Table)
                    .if_not_exists()
                    .col(pk(MaintenanceReport::TaskID))
                    .foreign_key(
                        ForeignKey::create()
                            .from(MaintenanceReport::Table, MaintenanceReport::TaskID)
                            .to(MaintenanceTask::Table, MaintenanceTask::TaskID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(string(MaintenanceReport::ReportingStaff))
                    .foreign_key(
                        ForeignKey::create()
                            .from(MaintenanceReport::Table, MaintenanceReport::ReportingStaff)
                            .to(Staff::Table, Staff::StaffID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(string(MaintenanceReport::ReportDescription))
                    .col(string(MaintenanceReport::ReportImage))
                    .col(string(MaintenanceReport::ReportStatus))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(MaintenanceReport::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum MaintenanceReport {
    Table,
    TaskID,
    ReportDescription,
    ReportImage,
    ReportStatus,
    ReportingStaff,
}

#[derive(DeriveIden)]
enum Staff{
    Table,
    StaffID,
}

#[derive(DeriveIden)]
enum MaintenanceTask{
    Table,
    TaskID,
}


