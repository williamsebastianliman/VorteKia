import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import CEONavigationBar from "../../../components/CEONavigationBar";

type Store = {
  store_id: string;
  store_name: string;
  store_description: string;
  store_image: string;
  staff_id: string | null;
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

type Staff = {
  staff_id: string;
  staff_name: string;
};

function ViewStoreDetailCEO() {
  const { id } = useParams();
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeImage, setStoreImage] = useState("");
  const [storeOpenTime, setStoreOpenTime] = useState("");
  const [storeCloseTime, setStoreCloseTime] = useState("");
  const [assignedSA, setAssignedSA] = useState<string>("");
  const [salesAssociates, setSalesAssociates] = useState<Staff[]>([]);
  const [image, setNewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const navigate = useNavigate();

  async function fetchSouvenirs() {
    toast.dismiss();
    try {
      const data: Souvenir[] = await invoke("get_all_souvenirs_by_store", {
        id,
      });
      setSouvenirs(data);
    } catch (error) {
      toast.error(error as string);
    }
  }

  async function fetchStoreDetail() {
    try {
      const store: Store = await invoke("get_store_by_id", { id });
      setStoreName(store.store_name);
      setStoreDescription(store.store_description);
      setStoreImage(store.store_image);
      setStoreOpenTime(store.store_open_time.slice(0, 5));
      setStoreCloseTime(store.store_close_time.slice(0, 5));

      if (store.staff_id) {
        setAssignedSA(store.staff_id);

        const assignedStaff: Staff = await invoke("get_staff_by_id", {
          id: store.staff_id,
        });

        setSalesAssociates((prev) => [
          assignedStaff,
          ...prev.filter((s) => s.staff_id !== assignedStaff.staff_id),
        ]);
      }
    } catch (error) {
      toast.error("Failed to load store details.");
    }
  }

  async function fetchSalesAssociates() {
    try {
      const saList: Staff[] = await invoke("get_staff_by_role", {
        role: "SA",
      });
      const allStores: Store[] = await invoke("get_all_stores");

      const assignedIds = allStores
        .filter((store) => store.staff_id)
        .map((store) => store.staff_id);

      const unassignedSAs = saList.filter(
        (sa) => !assignedIds.includes(sa.staff_id)
      );

      setSalesAssociates((prev) => [...prev, ...unassignedSAs]);
    } catch (error) {
      toast.error("Failed to fetch sales associates");
    }
  }

  async function handleAssignSA(event: React.ChangeEvent<HTMLSelectElement>) {
    const staffId = event.target.value;
    try {
      await invoke("assign_sales_associate", {
        storeId: id,
        staffId,
      });
      setAssignedSA(staffId);
      toast.success("Sales Associate assigned!");
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function handleUpdate() {
    toast.dismiss();
    try {
      let imageData = null;
      if (image) {
        const arrayBuffer = await image.arrayBuffer();
        imageData = Array.from(new Uint8Array(arrayBuffer));
      }
      await invoke("update_store_by_id", {
        id,
        name: storeName,
        description: storeDescription,
        imageData,
        openTime: storeOpenTime + ":00",
        closeTime: storeCloseTime + ":00",
      });
      toast.success("Successfully Updated Store!");
    } catch (error) {
      toast.error(error as string);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  async function handleDelete(
    id: String,
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    toast.dismiss();
    try {
      await invoke("delete_souvenir_by_id", { id });
      fetchSouvenirs();
    } catch (error) {
      toast.error(error as string);
    }
  }

  function updateSouvenir(id: String) {
    navigate(`/staff/ceo/updatesouvenir/${id}`);
  }

  useEffect(() => {
    fetchStoreDetail();
    fetchSouvenirs();
    fetchSalesAssociates();
  }, [id]);

  return (
    <div>
      <Toaster />
      <CEONavigationBar />
      <div className="flex flex-col bg-gray-100 min-h-screen items-center">
        <div className="w-full h-64 relative">
          <img
            src={previewImage || `../../${storeImage}`}
            alt="Store Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 bg-white w-3xl mt-6 shadow-md rounded-md">
          <h2 className="text-center font-bold text-2xl">Store Details</h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-gray-700">Store Name</span>
              <input
                type="text"
                className="border px-4 w-full rounded-md py-2"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Description</span>
              <textarea
                className="border px-4 w-full rounded-md py-2"
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Open Time</span>
              <input
                type="time"
                className="border px-4 w-full rounded-md py-2"
                value={storeOpenTime}
                onChange={(e) => setStoreOpenTime(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Close Time</span>
              <input
                type="time"
                className="border px-4 w-full rounded-md py-2"
                value={storeCloseTime}
                onChange={(e) => setStoreCloseTime(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Upload New Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Assign Sales Associate</span>
              <select
                className="w-full border px-4 py-2 rounded-md"
                value={assignedSA}
                onChange={handleAssignSA}
              >
                <option value="">None</option>
                {salesAssociates.map((sa) => (
                  <option key={sa.staff_id} value={sa.staff_id}>
                    {sa.staff_id} - {sa.staff_name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            onClick={handleUpdate}
            className="bg-blue-500 px-4 py-2 rounded-md text-white mt-4.5"
          >
            Save Changes
          </button>
        </div>

        <div className="p-6 bg-white w-6xl mt-32 shadow-md rounded-md">
          <h2 className="text-2xl font-bold text-center">All Souvenirs</h2>
          <div className="flex flex-row mb-5">
            <button
              className="bg-blue-500 px-4 py-2 rounded-md text-white mt-4.5"
              onClick={() => navigate(`/staff/ceo/addsouvenir/${id}`)}
            >
              Add Souvenir
            </button>
          </div>

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
                <p className="text-black">Stock: {souvenir.souvenir_stock}</p>
                <div className="flex col-auto gap-5 mt-2">
                  <button
                    className="bg-red-600 rounded text-white px-2 py-1"
                    onClick={(e) => handleDelete(souvenir.souvenir_id, e)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-600 rounded text-white px-2 py-1"
                    onClick={() => updateSouvenir(souvenir.souvenir_id)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStoreDetailCEO;
