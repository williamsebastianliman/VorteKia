use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(NewStoreProposal::Table)
                    .if_not_exists()
                    .col(pk_auto(NewStoreProposal::ProposalId))
                    .col(string(NewStoreProposal::StoreName))
                    .col(string(NewStoreProposal::StoreDescription))
                    .col(time(NewStoreProposal::StoreOpenTime))
                    .col(time(NewStoreProposal::StoreCloseTime))
                    .col(string(NewStoreProposal::StoreLocation))
                    .col(string(NewStoreProposal::FileLink))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(NewStoreProposal::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum NewStoreProposal {
    Table,
    ProposalId,
    StoreName,
    StoreDescription,
    StoreOpenTime,
    StoreCloseTime,
    StoreLocation,
    FileLink,
}
