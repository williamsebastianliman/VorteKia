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
                    .table(Store::Table)
                    .if_not_exists()
                    .col(pk(Store::StoreID))
                    .col(string(Store::StoreName))
                    .col(string(Store::StoreDescription))
                    .col(string(Store::StoreImage))
                    .col(string(Store::StoreLocation))
                    .col(time(Store::StoreOpenTime))
                    .col(time(Store::StoreCloseTime))
                    .col(ColumnDef::new(Store::StaffId).string_len(20))
                    .foreign_key(
                        ForeignKey::create()
                            .from(Store::Table, Store::StaffId)
                            .to(Staff::Table, Staff::StaffID)
                            .on_delete(ForeignKeyAction::SetNull)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Store::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Staff {
    Table,
    StaffID,
}

#[derive(DeriveIden)]
enum Store {
    Table,
    StoreID,
    StoreName,
    StoreDescription,
    StoreImage,
    StoreOpenTime,
    StoreCloseTime,
    StoreLocation,
    StaffId,
}
