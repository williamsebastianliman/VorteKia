import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate, useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import RMNavigationBar from "../../components/RMNavigationBar";

type TransactionDetail = {
  transaction_id: number;
  souvenir_id: string;
  quantity: number;
  price: number;
};

type Souvenir = {
  souvenir_id: string;
  souvenir_name: string;
};

function TransactionDetailRM() {
  const { id } = useParams();
  const [details, setDetails] = useState<TransactionDetail[]>([]);
  const [souvenirNames, setSouvenirNames] = useState<Record<string, string>>(
    {}
  );
  const navigate = useNavigate();

  async function fetchTransactionDetail() {
    try {
      const result: TransactionDetail[] = await invoke(
        "get_store_transaction_detail_by_header",
        {
          id: parseInt(id as string),
        }
      );
      setDetails(result);

      const nameMap: Record<string, string> = {};
      for (const item of result) {
        const souvenir: Souvenir = await invoke("get_souvenir_by_id", {
          id: item.souvenir_id,
        });
        nameMap[item.souvenir_id] = souvenir.souvenir_name;
      }
      setSouvenirNames(nameMap);
    } catch (err) {
      toast.error(err as string);
    }
  }

  function calculateGrandTotal(): number {
    return details.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  }

  useEffect(() => {
    fetchTransactionDetail();
  }, [id]);

  return (
    <div>
      <Toaster />
      <RMNavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 text-white px-4 py-2 rounded mb-6"
        >
          Back
        </button>
        <h1 className="text-3xl font-bold mb-6 underline">
          Transaction Detail
        </h1>
        <p className="text-xl font-semibold mb-8">
          Grand Total:{" "}
          <span className="text-green-600">{calculateGrandTotal()}</span>
        </p>
        <div className="grid grid-cols-2 gap-6">
          {details.map((d) => (
            <div
              key={d.souvenir_id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <p className="text-gray-700 font-semibold">
                Souvenir: {souvenirNames[d.souvenir_id] || d.souvenir_id}
              </p>
              <p className="text-gray-700">Price: {d.price}</p>
              <p className="text-gray-700">Quantity: {d.quantity}</p>
              <p className="text-gray-700 font-bold">
                Subtotal: {d.quantity * d.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailRM;
