use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RideTransaction::Table)
                    .if_not_exists()
                    .col(pk_auto(RideTransaction::TransactionId))
                    .col(ColumnDef::new(RideTransaction::CustomerID).string_len(10).not_null())
                    .col(ColumnDef::new(RideTransaction::Price).integer().not_null())
                    .col(
                        ColumnDef::new(RideTransaction::TransactionDate)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RideTransaction::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RideTransaction {
    Table,
    TransactionId,
    CustomerID,
    Price,
    TransactionDate,
}