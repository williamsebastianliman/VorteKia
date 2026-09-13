use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;
pub fn pk(col: impl IntoIden) -> ColumnDef {
    ColumnDef::new(col).string_len(12).not_null().primary_key().to_owned()
}


#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .create_table(
                Table::create()
                    .table(Staff::Table)
                    .if_not_exists()
                    .col(pk(Staff::StaffID))
                    .col(string(Staff::StaffName).not_null())
                    .col(string(Staff::StaffEmail).not_null())
                    .col(string(Staff::StaffPassword).not_null())
                    .col(string(Staff::StaffRole).not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(Staff::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Staff {
    Table,
    StaffID,
    StaffName,
    StaffEmail,
    StaffPassword,
    StaffRole
}
