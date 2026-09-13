use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(CustomerInquiries::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(CustomerInquiries::ChatId)
                            .integer()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(CustomerInquiries::SenderCustomerId).string().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(CustomerInquiries::Table, CustomerInquiries::SenderCustomerId)
                            .to(Customer::Table, Customer::CustomerID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(ColumnDef::new(CustomerInquiries::Message).string().not_null())
                    .col(
                        ColumnDef::new(CustomerInquiries::Timestamp)
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
            .drop_table(Table::drop().table(CustomerInquiries::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Customer {
    Table,
    CustomerID,
}

#[derive(DeriveIden)]
enum CustomerInquiries {
    Table,
    ChatId,
    SenderCustomerId,
    Message,
    Timestamp,
}
