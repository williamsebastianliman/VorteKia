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
                    .table(Restaurant::Table)
                    .if_not_exists()
                    .col(pk(Restaurant::RestaurantID))
                    .col(string(Restaurant::RestaurantName))
                    .col(string(Restaurant::RestaurantCuisine))
                    .col(string(Restaurant::RestaurantDescription))
                    .col(string(Restaurant::RestaurantImage))
                    .col(string(Restaurant::RestaurantLocation))
                    .col(time(Restaurant::RestaurantOpenTime))
                    .col(time(Restaurant::RestaurantCloseTime))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(Restaurant::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Restaurant {
    Table,
    RestaurantID,
    RestaurantName,
    RestaurantCuisine,
    RestaurantDescription,
    RestaurantImage,
    RestaurantLocation,
    RestaurantOpenTime,
    RestaurantCloseTime,
}
