use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;
pub fn pk(col: impl IntoIden) -> ColumnDef {
    ColumnDef::new(col).string_len(12).not_null().primary_key().to_owned()
}
#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .create_table(
                Table::create()
                    .table(Customer::Table)
                    .if_not_exists()
                    .col(pk(Customer::CustomerID))
                    .col(string(Customer::CustomerName))
                    .col(integer(Customer::CustomerBalance))
                    .col(string(Customer::CustomerPhoneNumber))
                    .col(string(Customer::CustomerEmail))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(Customer::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Customer {
    Table,
    CustomerID,
    CustomerName,
    CustomerBalance,
    CustomerPhoneNumber,
    CustomerEmail
}
