use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;


pub fn pk(col: impl IntoIden) -> ColumnDef {
        ColumnDef::new(col).string_len(20).not_null().to_owned()
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .create_table(
                Table::create()
                    .table(AssignedWaiter::Table)
                    .if_not_exists()
                    .col(pk(AssignedWaiter::StaffID))
                    .col(pk(AssignedWaiter::RestaurantID))
                    .primary_key(
                        Index::create() 
                            .primary()
                            .col(AssignedWaiter::StaffID)
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(AssignedWaiter::Table, AssignedWaiter::StaffID)
                            .to(Staff::Table, Staff::StaffID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(AssignedWaiter::Table, AssignedWaiter::RestaurantID)
                            .to(Restaurant::Table, Restaurant::RestaurantID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(string(AssignedWaiter::Description))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(AssignedWaiter::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum AssignedWaiter {
    Table,
    StaffID,
    RestaurantID,
    Description
}

#[derive(DeriveIden)]
enum Staff
{
    Table,
    StaffID
}

#[derive(DeriveIden)]
enum Restaurant
{
    Table,
    RestaurantID
}


