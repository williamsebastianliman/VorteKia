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
                    .table(Souvenir::Table)
                    .if_not_exists()                    
                    .col(pk(Souvenir::SouvenirID))
                    .col(string(Souvenir::SouvenirName))
                    .col(string(Souvenir::SouvenirImage))
                    .col(string(Souvenir::SouvenirDescription))
                    .col(integer(Souvenir::SouvenirPrice))
                    .col(integer(Souvenir::SouvenirStock))
                    .col(string(Souvenir::StoreID))
                    .foreign_key(
                        ForeignKey::create()
                            .from(Souvenir::Table, Souvenir::StoreID)
                            .to(Store::Table, Store::StoreID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(Souvenir::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Souvenir {
    Table,
    SouvenirID,
    SouvenirName,
    SouvenirImage,
    SouvenirPrice,
    SouvenirStock,
    SouvenirDescription,
    StoreID
}

#[derive(DeriveIden)]
enum Store {
    Table,
    StoreID,
}

