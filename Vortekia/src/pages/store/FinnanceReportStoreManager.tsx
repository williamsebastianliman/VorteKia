import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import RMNavigationBar from "../../components/RMNavigationBar";

type TransactionDetail = {
  transaction_id: number;
  souvenir_id: string;
  quantity: number;
  price: number;
};

type TransactionHeader = {
  transaction_id: number;
  transaction_date: string;
  customer_id: string;
  store_id: string;
};

type StoreTransaction = {
  header: TransactionHeader;
  details: TransactionDetail[];
};

function FinanceReportStoreManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<StoreTransaction[]>([]);
  const [revenueToday, setRevenueToday] = useState<number>(0);

  function isToday(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  async function fetchTransactions() {
    try {
      const result: StoreTransaction[] = await invoke(
        "get_store_transactions_with_details",
        { storeId: id }
      );

      const today = result.filter((t) => isToday(t.header.transaction_date));

      const todayRevenue = today.reduce((total, t) => {
        const transactionTotal = t.details.reduce(
          (sub, d) => sub + d.quantity * d.price,
          0
        );
        return total + transactionTotal;
      }, 0);

      setRevenueToday(todayRevenue);
      setTransactions(result);
    } catch (err) {
      toast.error(err as string);
    }
  }

  function calculateTransactionTotal(details: TransactionDetail[]) {
    return details.reduce((sum, d) => sum + d.quantity * d.price, 0);
  }

  useEffect(() => {
    if (id) {
      fetchTransactions();
    }
  }, [id]);

  return (
    <div>
      <Toaster />
      <RMNavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 underline">Finance Report</h1>
        <div className="text-xl font-semibold mb-8">
          Revenue Today: <span className="text-green-600">{revenueToday}</span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {transactions.map((t) => (
            <div
              key={t.header.transaction_id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <p className="text-gray-700 font-semibold">
                Transaction ID: {t.header.transaction_id}
              </p>
              <p className="text-gray-700">
                Date: {formatDateTime(t.header.transaction_date)}
              </p>
              <p className="text-gray-700 font-bold">
                Grand Total: {calculateTransactionTotal(t.details)}
              </p>
              <button
                onClick={() =>
                  navigate(`/staff/rm/td/${t.header.transaction_id}`)
                }
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Detail
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FinanceReportStoreManager;
