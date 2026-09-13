use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(GroupChat::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(GroupChat::GroupId).string().not_null().primary_key())
                    .col(ColumnDef::new(GroupChat::GroupName).string().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(GroupChat::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum GroupChat {
    Table,
    GroupId,
    GroupName,
}
