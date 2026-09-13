import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CFONavigationBar from "../../components/CFONavigationBar";

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

type ViewMode = "daily" | "weekly" | "monthly";

function ViewStoreFinanceCFO() {
  const { id } = useParams();
  const [transactions, setTransactions] = useState<StoreTransaction[]>([]);
  const [filtered, setFiltered] = useState<StoreTransaction[]>([]);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewMode>("daily");

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, date, view]);

  async function fetchTransactions() {
    try {
      const result: StoreTransaction[] = await invoke(
        "get_store_transactions_with_details",
        { storeId: id }
      );
      result.sort(
        (a, b) =>
          new Date(b.header.transaction_date).getTime() -
          new Date(a.header.transaction_date).getTime()
      );
      setTransactions(result);
    } catch (err) {
      toast.error(err as string);
    }
  }

  function filterTransactions() {
    const start = new Date(date);
    let end = new Date(date);

    if (view === "daily") {
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setHours(23, 59, 59, 999);
    } else if (view === "weekly") {
      const day = start.getDay();
      const diffToMonday = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diffToMonday);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (view === "monthly") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end = new Date(
        start.getFullYear(),
        start.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    }

    const result = transactions.filter((t) => {
      const d = new Date(t.header.transaction_date);
      return d >= start && d <= end;
    });

    const total = result.reduce(
      (acc, t) =>
        acc + t.details.reduce((sum, d) => sum + d.price * d.quantity, 0),
      0
    );

    setFiltered(result);
    setGrandTotal(total);
  }

  function changeDate(amount: number) {
    const newDate = new Date(date);
    if (view === "daily") newDate.setDate(date.getDate() + amount);
    else if (view === "weekly") newDate.setDate(date.getDate() + 7 * amount);
    else if (view === "monthly") newDate.setMonth(date.getMonth() + amount);
    setDate(newDate);
  }

  function formatViewRange(): string {
    const start = new Date(date);
    let end = new Date(date);

    if (view === "weekly") {
      const day = start.getDay();
      const diffToMonday = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diffToMonday);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
    } else if (view === "monthly") {
      start.setDate(1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    }

    return view === "daily"
      ? `${start.toLocaleDateString()}`
      : `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }

  function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  return (
    <div>
      <Toaster />
      <CFONavigationBar />
      <div className="p-10 bg-white min-h-screen text-black">
        <h1 className="text-4xl font-bold mb-8">Store Finance Report</h1>

        <div className="flex justify-between items-center mb-8">
          <div className="space-x-4">
            <button
              onClick={() => changeDate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Prev
            </button>
            <span className="text-xl font-semibold">{formatViewRange()}</span>
            <button
              onClick={() => changeDate(1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
          <select
            value={view}
            onChange={(e) => setView(e.target.value as ViewMode)}
            className="border border-gray-400 px-4 py-2 rounded text-black"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="text-2xl font-bold mb-10">
          Total Revenue: <span className="text-green-600">{grandTotal}</span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {filtered.map((t) => (
            <div
              key={t.header.transaction_id}
              className="bg-white rounded-lg shadow-lg border p-6"
            >
              <p className="text-lg font-bold">
                Transaction ID: {t.header.transaction_id}
              </p>
              <p className="text-black">
                Date: {formatDateTime(t.header.transaction_date)}
              </p>
              <p className="text-black font-semibold">
                Total:{" "}
                {t.details.reduce((sum, d) => sum + d.quantity * d.price, 0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewStoreFinanceCFO;
