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
                    .table(MenuHistory::Table)
                    .if_not_exists()
                    .col(pk(MenuHistory::MenuHistoryID))
                    .col(string(MenuHistory::MenuHistoryName))
                    .col(integer(MenuHistory::MenuHistoryPrice))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(MenuHistory::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum MenuHistory {
    Table,
    MenuHistoryID,
    MenuHistoryName,
    MenuHistoryPrice,
}
