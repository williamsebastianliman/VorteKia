import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import RMNavigationBar from "../../components/RMNavigationBar";
import CFONavigationBar from "../../components/CFONavigationBar";

type Store = {
  store_id: string;
  store_name: string;
  store_description: string;
  store_image: string;
};

function ViewAllStoreCFO() {
  const [stores, setStores] = useState<Store[]>([]);
  const navigate = useNavigate();

  async function fetchStores() {
    try {
      const data: Store[] = await invoke("get_all_stores");
      setStores(data);
    } catch (error) {
      toast.error(error as string);
    }
  }

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div>
      <Toaster />
      <CFONavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-12 underline">Stores</h1>

        <div className="flex flex-col gap-6 items-center justify-center">
          {stores.map((store) => (
            <div
              key={store.store_id}
              className="bg-white shadow-md rounded-lg p-4 w-4xl flex gap-5 flex-col"
            >
              <div className="w-full h-48 bg-gray-200 rounded-lg">
                {store.store_image ? (
                  <img
                    src={`../${store.store_image}`}
                    alt={store.store_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p>No Image</p>
                )}
              </div>

              <h2 className="text-xl font-semibold mt-2">{store.store_name}</h2>
              <p className="text-gray-600">{store.store_description}</p>
              <div className="flex col-auto gap-5 mt-2">
                <button
                  className="bg-green-600 rounded text-white px-2 py-1"
                  onClick={() =>
                    navigate(`/staff/cfo/storereport/${store.store_id}`)
                  }
                >
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewAllStoreCFO;
