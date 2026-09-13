use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(InquriesResponse::Table)
                    .if_not_exists()
                    .col(pk_auto(InquriesResponse::ChatId))
                    .col(string(InquriesResponse::CustomerID))
                    .col(string(InquriesResponse::Message))
                    .col(
                        ColumnDef::new(InquriesResponse::Timestamp)
                            .date_time()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_inquries_response_customer")
                            .from(InquriesResponse::Table, InquriesResponse::CustomerID)
                            .to(Customer::Table, Customer::CustomerID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(InquriesResponse::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Customer {
    Table,
    CustomerID,
}

#[derive(DeriveIden)]
enum InquriesResponse {
    Table,
    ChatId,
    CustomerID,
    Message,
    Timestamp,
}
