use crate::entities::{store_transaction_detail, store_transaction_header};

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct StoreTransaction {
    pub header: store_transaction_header::Model,
    pub details: Vec<store_transaction_detail::Model>,
}