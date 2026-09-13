use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Chat::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Chat::ChatId)
                            .integer()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Chat::SenderStaffId).string().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(Chat::Table, Chat::SenderStaffId)
                            .to(Staff::Table, Staff::StaffID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(ColumnDef::new(Chat::GroupId).string().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(Chat::Table, Chat::GroupId)
                            .to(GroupChat::Table, GroupChat::GroupId)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(ColumnDef::new(Chat::Message).string().not_null())
                    .col(
                        ColumnDef::new(Chat::Timestamp)
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
            .drop_table(Table::drop().table(Chat::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Staff {
    Table,
    StaffID,
}

#[derive(DeriveIden)]
enum GroupChat {
    Table,
    GroupId,
}

#[derive(DeriveIden)]
enum Chat {
    Table,
    ChatId,
    SenderStaffId,
    GroupId,
    Message,
    Timestamp,
}
