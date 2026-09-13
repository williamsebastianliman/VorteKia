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
                    .table(NewRideProposal::Table)
                    .if_not_exists()
                    .col(pk(NewRideProposal::ProposalID))
                    .col(string(NewRideProposal::RideName))
                    .col(string(NewRideProposal::RideDescription))
                    .col(integer(NewRideProposal::RidePrice))
                    .col(time(NewRideProposal::RideOpenTime))
                    .col(time(NewRideProposal::RideCloseTime))
                    .col(string(NewRideProposal::FileLink))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(NewRideProposal::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum NewRideProposal {
    Table,
    ProposalID,
    RideName,
    RideDescription,
    RidePrice,
    RideOpenTime,
    RideCloseTime,
    FileLink
}
