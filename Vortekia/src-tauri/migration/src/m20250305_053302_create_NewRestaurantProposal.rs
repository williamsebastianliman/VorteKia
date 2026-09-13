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
                    .table(NewRestaurantProposal::Table)
                    .if_not_exists()
                    .col(pk_auto(NewRestaurantProposal::ProposalID))
                    .col(string(NewRestaurantProposal::RestaurantName))
                    .col(string(NewRestaurantProposal::RestaurantCuisine))
                    .col(string(NewRestaurantProposal::RestaurantDescription))
                    .col(time(NewRestaurantProposal::RestaurantOpenTime))
                    .col(time(NewRestaurantProposal::RestaurantCloseTime))
                    .col(string(NewRestaurantProposal::FileLink))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        todo!();

        manager
            .drop_table(Table::drop().table(NewRestaurantProposal::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum NewRestaurantProposal {
    Table,
    ProposalID,
    RestaurantName,
    RestaurantCuisine,
    RestaurantDescription,
    RestaurantOpenTime,
    RestaurantCloseTime,
    FileLink
}
