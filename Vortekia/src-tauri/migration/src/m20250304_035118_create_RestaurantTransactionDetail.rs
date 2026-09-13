use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

pub fn pk(col: impl IntoIden) -> ColumnDef {
    ColumnDef::new(col).string_len(5).not_null().to_owned() 
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RestaurantTransactionDetail::Table)
                    .if_not_exists()
                    .col(pk(RestaurantTransactionDetail::TransactionID))
                    .col(pk(RestaurantTransactionDetail::MenuHistoryID))
                    .col(integer(RestaurantTransactionDetail::Quantity))
                    .primary_key(
                        Index::create() 
                            .primary()
                            .col(RestaurantTransactionDetail::TransactionID)
                            .col(RestaurantTransactionDetail::MenuHistoryID),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(RestaurantTransactionDetail::Table, RestaurantTransactionDetail::TransactionID)
                            .to(RestaurantTransactionHeader::Table, RestaurantTransactionHeader::TransactionID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(RestaurantTransactionDetail::Table, RestaurantTransactionDetail::MenuHistoryID)
                            .to(MenuHistory::Table, MenuHistory::MenuHistoryID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RestaurantTransactionDetail::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RestaurantTransactionDetail {
    Table,
    TransactionID,
    MenuHistoryID,
    Quantity,
}

#[derive(DeriveIden)]
enum MenuHistory {
    Table,
    MenuHistoryID,
}

#[derive(DeriveIden)]
enum RestaurantTransactionHeader {
    Table,
    TransactionID,
}
