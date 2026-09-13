import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CSNavigationBar from "../../../components/CSNavigationBar";
import CSTNavigationBar from "../../../components/CSTNavigationBar";

type Store = {
  store_id: string;
  store_name: string;
  store_description: string;
  store_image: string;
  store_open_time: string;
  store_close_time: string;
};

function ViewStoreDetailCustomer() {
  const { id } = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  async function fetchStoreDetail() {
    try {
      
      const result: Store = await invoke("get_store_by_id", { id });
      setStore(result);
    } catch (error) {
      toast.error(error as string);
    }
  }

  async function fetchStoreStatus() {
    try {
      const status: boolean = await invoke("is_store_open", { id });
      setIsOpen(status);
    } catch (_) {
      setIsOpen(null);
    }
  }

  useEffect(() => {
    fetchStoreDetail();
    fetchStoreStatus();
    const interval = setInterval(fetchStoreStatus, 1000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div>
      <Toaster />
      <CSTNavigationBar />
      <div className="flex flex-col bg-gray-100 min-h-screen items-center">
        {store && (
          <>
            <div className="w-full h-64 relative">
              <img
                src={`../../${store.store_image}`}
                alt="Store Banner"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 bg-white w-3xl mt-6 shadow-md rounded-md">
              <h2 className="text-center font-bold text-2xl mb-4">
                Store Details
              </h2>

              <div className="space-y-4">
                <div>
                  <span className="block font-semibold text-gray-700">
                    Name:
                  </span>
                  <p className="text-gray-900">{store.store_name}</p>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">
                    Description:
                  </span>
                  <p className="text-gray-900">{store.store_description}</p>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">
                    Open Time:
                  </span>
                  <p className="text-gray-900">{store.store_open_time}</p>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">
                    Close Time:
                  </span>
                  <p className="text-gray-900">{store.store_close_time}</p>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">
                    Status:
                  </span>
                  <p
                    className={`font-bold ${
                      isOpen ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOpen === null
                      ? "Checking..."
                      : isOpen
                      ? "OPEN"
                      : "CLOSED"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ViewStoreDetailCustomer;
