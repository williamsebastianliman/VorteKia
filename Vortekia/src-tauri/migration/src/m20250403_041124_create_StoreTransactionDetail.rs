use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(StoreTransactionDetail::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(StoreTransactionDetail::TransactionID).integer().not_null())
                    .col(ColumnDef::new(StoreTransactionDetail::SouvenirID).string_len(10).not_null())
                    .col(ColumnDef::new(StoreTransactionDetail::Price).integer().not_null())
                    .col(ColumnDef::new(StoreTransactionDetail::Quantity).integer().not_null())
                    .primary_key(
                        Index::create()
                            .col(StoreTransactionDetail::TransactionID)
                            .col(StoreTransactionDetail::SouvenirID),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(StoreTransactionDetail::Table, StoreTransactionDetail::TransactionID)
                            .to(StoreTransactionHeader::Table, StoreTransactionHeader::TransactionID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(StoreTransactionDetail::Table, StoreTransactionDetail::SouvenirID)
                            .to(Souvenir::Table, Souvenir::SouvenirID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(StoreTransactionDetail::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum StoreTransactionDetail {
    Table,
    TransactionID,
    SouvenirID,
    Price,
    Quantity,
}

#[derive(DeriveIden)]
enum Souvenir {
    Table,
    SouvenirID,
}

#[derive(DeriveIden)]
enum StoreTransactionHeader {
    Table,
    TransactionID,
}
