import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast from "react-hot-toast";
import CCNavigationBar from "../../components/CCNavigationBar";

function TopUpPage() {
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState<number>(0);

  async function checkLoginAndGetCustomerId() {
    try {
      const isLoggedIn: boolean = await invoke("check_customer_login");
      if (!isLoggedIn) {
        toast.error("You are not logged in!");
        return;
      }
      const id: string = await invoke("get_logged_in_customer");
      setCustomerId(id);
    } catch (err) {
      toast.error("Failed to check login.");
    }
  }

  async function handleTopUp(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    toast.dismiss();

    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    try {
      const result: string = await invoke("update_customer_balance", {
        customerId: customerId,
        newBalance: amount,
      });

      await invoke("insert_notification", {
        customerId,
        message: `You have successfully topped up your balance by ${amount}`,
      });

      toast.success(result);
      setAmount(0);
    } catch (error) {
      toast.error(error as string);
    }
  }

  useEffect(() => {
    checkLoginAndGetCustomerId();
  }, []);

  return (
    <div>
      <CCNavigationBar />
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Top Up Balance
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Customer ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
                value={customerId}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Amount
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-md"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount to top up"
              />
            </div>
            <button
              onClick={handleTopUp}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Top Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TopUpPage;
