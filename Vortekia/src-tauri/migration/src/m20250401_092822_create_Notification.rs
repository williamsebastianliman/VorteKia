use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Notification::Table)
                    .if_not_exists()
                    .col(pk_auto(Notification::NotificationId))
                    .col(string(Notification::CustomerID))
                    .col(string(Notification::Message))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-notification-customer")
                            .from(Notification::Table, Notification::CustomerID)
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
            .drop_table(Table::drop().table(Notification::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Customer {
    Table,
    CustomerID,
}

#[derive(DeriveIden)]
enum Notification {
    Table,
    NotificationId,
    CustomerID,
    Message,
}
