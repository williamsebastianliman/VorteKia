use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(StoreRemovalProposal::Table)
                    .if_not_exists()
                    .col(pk_auto(StoreRemovalProposal::ProposalId))
                    .col(
                        ColumnDef::new(StoreRemovalProposal::StoreId)
                            .string_len(5)
                            .not_null(),
                    )
                    .col(string(StoreRemovalProposal::RemovalDescription))
                    .col(string(StoreRemovalProposal::FileLink))
                    .foreign_key(
                        ForeignKey::create()
                            .from(StoreRemovalProposal::Table, StoreRemovalProposal::StoreId)
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
            .drop_table(
                Table::drop()
                    .table(StoreRemovalProposal::Table)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Store {
    Table,
    StoreID,
}

#[derive(DeriveIden)]
enum StoreRemovalProposal {
    Table,
    ProposalId,
    StoreId,
    RemovalDescription,
    FileLink,
}