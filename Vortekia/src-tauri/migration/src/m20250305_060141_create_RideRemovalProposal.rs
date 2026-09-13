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
                    .table(RideRemovalProposal::Table)
                    .if_not_exists()
                    .col(pk(RideRemovalProposal::ProposalID))
                    .col(string(RideRemovalProposal::RideID))
                    .foreign_key(
                        ForeignKey::create()
                            .from(RideRemovalProposal::Table, RideRemovalProposal::RideID)
                            .to(Ride::Table, Ride::RideID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(string(RideRemovalProposal::RemovalDescription))
                    .col(string(RideRemovalProposal::ProposalFile))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(RideRemovalProposal::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RideRemovalProposal {
    Table,
    ProposalID,
    RideID,
    RemovalDescription,
    ProposalFile,
}

#[derive(DeriveIden)]
enum Ride{
    Table,
    RideID
}
