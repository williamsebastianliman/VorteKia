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
                    .table(Menu::Table)
                    .if_not_exists()
                    .col(pk(Menu::MenuID))
                    .col(string(Menu::MenuName))
                    .col(string(Menu::MenuDescription))
                    .col(integer(Menu::MenuPrice))
                    .col(string(Menu::MenuImage))
                    .col(string(Menu::RestaurantID))
                    .foreign_key(
                        ForeignKey::create()
                            .from(Menu::Table, Menu::RestaurantID)
                            .to(Restaurant::Table, Restaurant::RestaurantID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(string(Menu::MenuHistoryID))
                    .foreign_key(
                        ForeignKey::create()
                            .from(Menu::Table, Menu::MenuHistoryID)
                            .to(MenuHistory::Table, MenuHistory::MenuHistoryID)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )

                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .drop_table(Table::drop().table(Menu::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Menu {
    Table,
    MenuID,
    MenuName,
    MenuDescription,
    MenuPrice,
    MenuImage,
    RestaurantID,
    MenuHistoryID,
}

#[derive(DeriveIden)]
enum Restaurant{
    Table,
    RestaurantID,
}

#[derive(DeriveIden)]
enum MenuHistory{
    Table,
    MenuHistoryID,
}
