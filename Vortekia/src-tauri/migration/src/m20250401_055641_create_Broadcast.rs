use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Broadcast::Table)
                    .if_not_exists()
                    .col(pk_auto(Broadcast::BroadcastId))
                    .col(string(Broadcast::BroadcastType))
                    .col(string(Broadcast::BroadcastMessage))
                    .col(
                        ColumnDef::new(Broadcast::Timestamp)
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
            .drop_table(Table::drop().table(Broadcast::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Broadcast {
    Table,
    BroadcastId,
    BroadcastType,
    BroadcastMessage,
    Timestamp,
}
