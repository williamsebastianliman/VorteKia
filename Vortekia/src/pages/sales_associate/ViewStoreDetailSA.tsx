import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import SANavigationBar from "../../components/SANavigationBar";

type Store = {
  store_id: string;
  store_name: string;
  store_description: string;
  store_image: string;
  store_open_time: string;
  store_close_time: string;
};

type Souvenir = {
  souvenir_id: string;
  souvenir_name: string;
  souvenir_description: string;
  souvenir_price: Int32Array;
  souvenir_stock: Int32Array;
  souvenir_image: string;
};

function ViewStoreDetailSA() {
  const [store, setStore] = useState<Store | null>(null);
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  async function fetchStoreData() {
    try {
      const staffId: string = await invoke("get_logged_in_staff");
      const assignment: { store_id: string } | null = await invoke(
        "get_store_by_staff_id",
        {
          staffId,
        }
      );

      if (!assignment || !assignment.store_id) {
        toast.error("No store assigned.");
        return;
      }

      const store: Store = await invoke("get_store_by_id", {
        id: assignment.store_id,
      });
      setStore(store);

      const souvenirData: Souvenir[] = await invoke(
        "get_all_souvenirs_by_store",
        {
          id: assignment.store_id,
        }
      );
      setSouvenirs(souvenirData);

      const status: boolean = await invoke("is_store_open", {
        id: assignment.store_id,
      });
      setIsOpen(status);
    } catch (error) {
      toast.error(error as string);
    }
  }

  useEffect(() => {
    fetchStoreData();
  }, []);

  return (
    <div>
      <Toaster />
      <SANavigationBar />
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
              <h2 className="text-center font-bold text-2xl">Store Details</h2>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Name:</strong> {store.store_name}
                </p>
                <p>
                  <strong>Description:</strong> {store.store_description}
                </p>
                <p>
                  <strong>Open Time:</strong> {store.store_open_time}
                </p>
                <p>
                  <strong>Close Time:</strong> {store.store_close_time}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={isOpen ? "text-green-600" : "text-red-600"}>
                    {isOpen === null
                      ? "Loading..."
                      : isOpen
                      ? "Open"
                      : "Closed"}
                  </span>
                </p>
              </div>
            </div>

            <div className="p-6 bg-white w-6xl mt-10 shadow-md rounded-md">
              <h2 className="text-2xl font-bold text-center">All Souvenirs</h2>
              <div className="grid grid-cols-4 gap-6">
                {souvenirs.map((souvenir) => (
                  <div
                    key={souvenir.souvenir_id}
                    className="bg-white shadow-md rounded-lg p-4"
                  >
                    <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                      {souvenir.souvenir_image ? (
                        <img
                          src={`../../${souvenir.souvenir_image}`}
                          alt={souvenir.souvenir_image}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <p className="text-gray-500 text-center">No Image</p>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold mt-2">
                      {souvenir.souvenir_name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {souvenir.souvenir_description}
                    </p>
                    <p className="text-black mt-2.5">
                      Price: {souvenir.souvenir_price}
                    </p>
                    <p className="text-black">
                      Stock: {souvenir.souvenir_stock}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ViewStoreDetailSA;
