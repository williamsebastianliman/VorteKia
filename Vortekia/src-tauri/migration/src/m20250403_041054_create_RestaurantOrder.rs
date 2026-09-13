use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RestaurantOrder::Table)
                    .if_not_exists()
                    .col(pk_auto(RestaurantOrder::OrderId))
                    .col(
                        ColumnDef::new(RestaurantOrder::TransactionID)
                            .string_len(5)
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(RestaurantOrder::StaffId)
                            .string_len(20)
                    )
                    .col(string(RestaurantOrder::Status))
                    .foreign_key(
                        ForeignKey::create()
                            .from(RestaurantOrder::Table, RestaurantOrder::TransactionID)
                            .to(RestaurantTransactionHeader::Table, RestaurantTransactionHeader::TransactionID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(RestaurantOrder::Table, RestaurantOrder::StaffId)
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
            .drop_table(
                Table::drop()
                    .table(RestaurantOrder::Table)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Staff {
    Table,
    StaffID,
}

#[derive(DeriveIden)]
enum RestaurantTransactionHeader {
    Table,
    TransactionID,
}

#[derive(DeriveIden)]
enum RestaurantOrder {
    Table,
    OrderId,
    TransactionID,
    StaffId,
    Status,
}