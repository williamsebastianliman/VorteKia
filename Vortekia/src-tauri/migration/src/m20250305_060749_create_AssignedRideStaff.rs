use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;


pub fn pk(col: impl IntoIden) -> ColumnDef {
        ColumnDef::new(col).string_len(5).not_null().to_owned()
}
pub fn pks(col: impl IntoIden) -> ColumnDef {
        ColumnDef::new(col).string_len(12).not_null().to_owned()
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .create_table(
                Table::create()
                    .table(AssignedRideStaff::Table)
                    .if_not_exists()
                    .col(pks(AssignedRideStaff::StaffID))
                    .col(pk(AssignedRideStaff::RideID))
                    .col(integer(AssignedRideStaff::Shift))
                    .primary_key(
                        Index::create() 
                            .primary()
                            .col(AssignedRideStaff::RideID)
                            .col(AssignedRideStaff::Shift)
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(AssignedRideStaff::Table, AssignedRideStaff::StaffID)
                            .to(Staff::Table, Staff::StaffID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(AssignedRideStaff::Table, AssignedRideStaff::RideID)
                            .to(Ride::Table, Ride::RideID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(AssignedRideStaff::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum AssignedRideStaff {
    Table,
    StaffID,
    RideID,
    Shift,
}

#[derive(DeriveIden)]
enum Staff{
    Table,
    StaffID
}

#[derive(DeriveIden)]
enum Ride{
    Table,
    RideID
}


