use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(OfficialAccount::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(OfficialAccount::OAId).string().not_null().primary_key())
                    .col(ColumnDef::new(OfficialAccount::OAName).string().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(OfficialAccount::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum OfficialAccount {
    Table,
    OAId,
    OAName,
}
