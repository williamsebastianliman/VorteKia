import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CRDNavigationBar from "../../../components/CRDNavigationBar";

type Customer = {
  customer_id: string;
  customer_name: string;
  customer_balance: number;
  customer_phone_number: string;
  customer_email: string;
};

function CustomerStatRD() {
  const [customer, setCustomer] = useState<Customer | null>(null);

  const fetchCustomerData = async () => {
    try {
      const loggedIn: String = await invoke("get_logged_in_customer");
      console.log("ID: " + loggedIn);
      const data: Customer = await invoke("get_customer_by_id", {
        id: loggedIn,
      });
      setCustomer(data);
    } catch (error) {
      toast.error(error as string);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  return (
    <div>
      <CRDNavigationBar />
      <div className="flex flex-col min-h-screen items-center bg-gray-100">
        <Toaster />
        <div className="p-6 bg-white mt-10 shadow-md rounded-md w-[32rem]">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Customer Statistics
          </h2>
          {customer ? (
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {customer.customer_name}
              </p>
              <p>
                <strong>Balance:</strong> ${customer.customer_balance}
              </p>
              <p>
                <strong>Phone Number:</strong> {customer.customer_phone_number}
              </p>
              <p>
                <strong>Email:</strong> {customer.customer_email}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Loading customer data...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerStatRD;
