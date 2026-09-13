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
                    .table(RestaurantTransactionHeader::Table)
                    .if_not_exists()
                    .col(pk(RestaurantTransactionHeader::TransactionID))
                    .col(timestamp(RestaurantTransactionHeader::TransactionDate)
                        .not_null()
                        .default(Keyword::CurrentTimestamp))
                    .col(string(RestaurantTransactionHeader::CustomerID))
                    .foreign_key(
                        ForeignKey::create()
                            .from(RestaurantTransactionHeader::Table, RestaurantTransactionHeader::CustomerID)
                            .to(Customer::Table, Customer::CustomerID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(string(RestaurantTransactionHeader::RestaurantID))
                    .foreign_key(
                        ForeignKey::create()
                            .from(RestaurantTransactionHeader::Table, RestaurantTransactionHeader::RestaurantID)
                            .to(Restaurant::Table, Restaurant::RestaurantID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(RestaurantTransactionHeader::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RestaurantTransactionHeader {
    Table,
    TransactionID,
    TransactionDate,
    CustomerID,
    RestaurantID,
}
#[derive(DeriveIden)]
enum Customer
{
    Table,
    CustomerID,
}
#[derive(DeriveIden)]
enum Restaurant
{
    Table,
    RestaurantID,
}

