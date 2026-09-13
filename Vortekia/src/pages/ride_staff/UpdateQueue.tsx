import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import RSNavigationBar from "../../components/RSNavigationBar";

type Customer = {
  customer_id: string;
  customer_name: string;
};

function UpdateQueue() {
  const { rid, qn } = useParams();
  const [searchName, setSearchName] = useState("");
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchName(value);

    if (value.length >= 1) {
      try {
        const results: Customer[] = await invoke(
          "get_customers_by_name_prefix",
          {
            prefix: value,
          }
        );
        setSuggestions(results);
      } catch (_) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSearchName(`${customer.customer_id}: ${customer.customer_name}`);
    setSelectedCustomerId(customer.customer_id);
    setSuggestions([]);
  };

  const handleUpdate = async () => {
    toast.dismiss();

    if (!selectedCustomerId || !rid || !qn) {
      toast.error("Please select a customer.");
      return;
    }

    try {
      await invoke("update_queue", {
        rideId: rid,
        queueNumber: parseInt(qn),
        newCustomerId: selectedCustomerId,
      });

      toast.success("Queue updated successfully!");
      navigate(-1);
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <div>
      <RSNavigationBar />
      <Toaster />
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 font-medium hover:underline"
          >
            Back
          </button>
          <h2 className="text-2xl font-bold text-center mb-4 text-black">
            Update Queue #{qn}
          </h2>

          <div className="relative mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              New Customer
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Search customer by name"
              value={searchName}
              onChange={handleSearchChange}
            />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 mt-1 w-full rounded-md shadow-md z-10">
                {suggestions.map((customer) => (
                  <li
                    key={customer.customer_id}
                    onClick={() => handleSelectCustomer(customer)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {customer.customer_id}: {customer.customer_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleUpdate}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Update Queue
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateQueue;
