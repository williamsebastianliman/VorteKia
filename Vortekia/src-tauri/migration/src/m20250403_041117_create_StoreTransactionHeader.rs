use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(StoreTransactionHeader::Table)
                    .if_not_exists()
                    .col(pk_auto(StoreTransactionHeader::TransactionID))
                    .col(
                        ColumnDef::new(StoreTransactionHeader::TransactionDate)
                            .timestamp()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(StoreTransactionHeader::CustomerID).string().not_null())
                    .col(ColumnDef::new(StoreTransactionHeader::StoreID).string().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(StoreTransactionHeader::Table, StoreTransactionHeader::CustomerID)
                            .to(Customer::Table, Customer::CustomerID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(StoreTransactionHeader::Table, StoreTransactionHeader::StoreID)
                            .to(Store::Table, Store::StoreID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(StoreTransactionHeader::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum StoreTransactionHeader {
    Table,
    TransactionID,
    TransactionDate,
    CustomerID,
    StoreID,
}

#[derive(DeriveIden)]
enum Customer {
    Table,
    CustomerID,
}

#[derive(DeriveIden)]
enum Store {
    Table,
    StoreID,
}