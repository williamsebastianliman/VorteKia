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
                    .table(Itemlog::Table)
                    .if_not_exists()
                    .col(pk(Itemlog::ItemlogID))
                    .col(string(Itemlog::ItemlogName))
                    .col(string(Itemlog::ItemlogType))
                    .col(string(Itemlog::ItemlogColor))
                    .col(string(Itemlog::ItemlogLocation))
                    .col(string(Itemlog::ItemlogImage))
                    .col(string(Itemlog::CustomerID).not_null())
                    .col(string(Itemlog::ItemlogStatus))
                    .foreign_key(
                        ForeignKey::create()
                            .from(Itemlog::Table, Itemlog::CustomerID)
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
            .drop_table(Table::drop().table(Itemlog::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Itemlog {
    Table,
    ItemlogID,
    ItemlogName,
    ItemlogColor,
    ItemlogLocation,
    ItemlogImage,
    ItemlogType,
    ItemlogStatus,
    CustomerID,
}
#[derive(DeriveIden)]
enum Customer {
    Table,
    CustomerID,
}

