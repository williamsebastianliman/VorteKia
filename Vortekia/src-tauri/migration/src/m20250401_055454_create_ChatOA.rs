use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(ChatOA::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(ChatOA::ChatId)
                            .integer()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(ChatOA::SenderStaffId).string().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(ChatOA::Table, ChatOA::SenderStaffId)
                            .to(Staff::Table, Staff::StaffID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(ColumnDef::new(ChatOA::OAId).string().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(ChatOA::Table, ChatOA::OAId)
                            .to(OfficialAccount::Table, OfficialAccount::OAId)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(ColumnDef::new(ChatOA::Message).string().not_null())
                    .col(
                        ColumnDef::new(ChatOA::IsReply)
                            .boolean()
                            .not_null()
                            .default(false),
                    )
                    .col(
                        ColumnDef::new(ChatOA::Timestamp)
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
            .drop_table(Table::drop().table(ChatOA::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Staff {
    Table,
    StaffID,
}

#[derive(DeriveIden)]
enum OfficialAccount {
    Table,
    OAId,
}

#[derive(DeriveIden)]
enum ChatOA {
    Table,
    ChatId,
    SenderStaffId,
    OAId,
    Message,
    IsReply,
    Timestamp,
}
