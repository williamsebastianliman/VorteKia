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
                    .table(RideQueue::Table)
                    .if_not_exists()
                    .col(pk(RideQueue::RideID))
                    .col(integer(RideQueue::QueueNumber))
                    .primary_key(
                        Index::create() 
                            .primary()
                            .col(RideQueue::RideID)
                            .col(RideQueue::QueueNumber),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(RideQueue::Table, RideQueue::RideID)
                            .to(Ride::Table, Ride::RideID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(string(RideQueue::CustomerID))
                    .foreign_key(
                        ForeignKey::create()
                            .from(RideQueue::Table, RideQueue::CustomerID)
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
            .drop_table(Table::drop().table(RideQueue::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RideQueue {
    Table,
    RideID,
    QueueNumber,
    CustomerID,
}
#[derive(DeriveIden)]
enum Ride {
    Table,
    RideID,
}
#[derive(DeriveIden)]
enum Customer
{
    Table,
    CustomerID
}
