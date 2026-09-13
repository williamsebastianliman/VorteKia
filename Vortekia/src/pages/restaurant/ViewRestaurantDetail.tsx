import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import FNBMNavigationBar from "../../components/FNBMNavigationBar";

type Restaurant = {
  restaurant_id: string;
  restaurant_name: string;
  restaurant_description: string;
  restaurant_image: string;
  restaurant_open_time: string;
  restaurant_close_time: string;
};

type Menu = {
  menu_id: string;
  menu_name: string;
  menu_description: string;
  menu_price: Int32Array;
  menu_image: string;
};

type Assignment = {
  staff_id: string;
  restaurant_id: string;
  description: string;
};

function ViewRestaurantDetail() {
  const { id } = useParams();
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [restaurantImage, setRestaurantImage] = useState("");
  const [image, setNewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [chefs, setChefs] = useState<Assignment[]>([]);
  const [waiters, setWaiters] = useState<Assignment[]>([]);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [chefCount, setChefCount] = useState(0);
  const [waiterCount, setWaiterCount] = useState(0);
  const navigate = useNavigate();

  async function fetchMenus() {
    toast.dismiss();
    try {
      const data: Menu[] = await invoke("get_all_menu_by_restaurant", { id });
      setMenus(data);
    } catch (error) {
      toast.error(error as string);
    }
  }

  async function fetchAssignments() {
    try {
      const chefData: Assignment[] = await invoke("get_chefs_by_restaurant", {
        restaurantId: id,
      });
      const waiterData: Assignment[] = await invoke(
        "get_waiters_by_restaurant",
        {
          restaurantId: id,
        }
      );
      setChefs(chefData);
      setWaiters(waiterData);
      setChefCount(chefData.length);
      setWaiterCount(waiterData.length);
    } catch (error) {
      toast.error("Failed to fetch assignments");
    }
  }

  async function fetchStatus() {
    try {
      const status: boolean = await invoke("is_restaurant_open", { id });
      setIsOpen(status);
    } catch (error) {
      toast.error("Failed to fetch status");
    }
  }

  async function handleDeleteMenu(
    id: String,
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    toast.dismiss();
    try {
      await invoke("delete_menu_by_id", { id });
      fetchMenus();
    } catch (error) {
      toast.error(error as string);
    }
  }

  async function updateMenu(id: String) {
    navigate(`/staff/fnbm/updatemenu/${id}`);
  }

  async function handleUpdate() {
    toast.dismiss();
    try {
      let imageData = null;
      if (image) {
        const arrayBuffer = await image.arrayBuffer();
        const binaryArray = Array.from(new Uint8Array(arrayBuffer));
        imageData = binaryArray;
      }
      await invoke("update_restaurant_by_id", {
        id,
        name: restaurantName,
        description: restaurantDescription,
        imageData,
        openTime,
        closeTime,
      });
      toast.success("Successfully Updating Restaurant!");
    } catch (error) {
      toast.error(error as string);
    }
  }

  async function fetchRestaurantDetail() {
    try {
      const restaurant: Restaurant = await invoke("get_restaurant_by_id", {
        id,
      });
      if (restaurant) {
        setRestaurantName(restaurant.restaurant_name);
        setRestaurantDescription(restaurant.restaurant_description);
        setRestaurantImage(restaurant.restaurant_image);
        setOpenTime(restaurant.restaurant_open_time);
        setCloseTime(restaurant.restaurant_close_time);
      }
    } catch (error) {
      toast.error("Failed to load store details.");
    }
  }

  useEffect(() => {
    fetchMenus();
    fetchAssignments();
    fetchRestaurantDetail();
    fetchStatus();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <Toaster />
      <FNBMNavigationBar />
      <div className="flex flex-col bg-gray-100 min-h-screen items-center">
        <div className="w-full h-64 relative">
          <img
            src={previewImage || `../../${restaurantImage}`}
            alt="Store Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 bg-white w-3xl mt-6 shadow-md rounded-md">
          <h2 className="text-center font-bold text-2xl">Restaurant Details</h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-gray-700">Restaurant Name</span>
              <input
                type="text"
                className="border px-4 w-full rounded-md py-2"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Description</span>
              <textarea
                className="border px-4 w-full rounded-md py-2"
                value={restaurantDescription}
                onChange={(e) => setRestaurantDescription(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Open Time</span>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="border px-4 w-full rounded-md py-2"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Close Time</span>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="border px-4 w-full rounded-md py-2"
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
          </div>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 px-4 py-2 rounded-md text-white mt-4.5"
          >
            Save Changes
          </button>
        </div>

        <div className="p-6 bg-white w-6xl mt-10 shadow-md rounded-md text-center">
          <h2 className="text-2xl font-bold">Restaurant Status</h2>
          <p
            className={`mt-3 text-lg font-semibold ${
              isOpen ? "text-green-600" : "text-red-600"
            }`}
          >
            {isOpen === null ? "Loading..." : isOpen ? "Open" : "Closed"}
          </p>
          <p className="mt-2">Chef Count: {chefCount}</p>
          <p className="mt-1">Waiter Count: {waiterCount}</p>
        </div>

        <div className="p-6 bg-white w-6xl mt-10 shadow-md rounded-md">
          <h2 className="text-2xl font-bold text-center">All Menu</h2>
          <div className="flex flex-row mb-5">
            <button
              className="bg-blue-500 px-4 py-2 rounded-md text-white"
              onClick={() => navigate(`/staff/fnbm/addmenu/${id}`)}
            >
              Add Menu
            </button>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {menus.map((menu) => (
              <div
                key={menu.menu_id}
                className="bg-white shadow-md rounded-lg p-4 relative"
              >
                <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                  {menu.menu_image ? (
                    <img
                      src={`../../${menu.menu_image}`}
                      alt={menu.menu_image}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p className="text-gray-500 text-center">No Image</p>
                  )}
                </div>
                <h2 className="text-xl font-semibold mt-2">{menu.menu_name}</h2>
                <p className="text-gray-600 text-sm">{menu.menu_description}</p>
                <p className="text-black mt-2.5 mb-18">
                  Price: {menu.menu_price}
                </p>
                <div className="flex col-auto gap-5 mt-2 items-center absolute bottom-7">
                  <button
                    className="bg-red-600 rounded text-white px-2 py-1"
                    onClick={(e) => handleDeleteMenu(menu.menu_id, e)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-600 rounded text-white px-2 py-1"
                    onClick={() => updateMenu(menu.menu_id)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white w-6xl mt-10 shadow-md rounded-md">
          <h2 className="text-2xl font-bold text-center">Assigned Chefs</h2>
          <button
            className="bg-blue-500 px-4 py-2 rounded-md text-white mb-4"
            onClick={() => navigate(`/staff/fnbm/allocatechef/${id}`)}
          >
            Allocate Chef
          </button>
          <div className="grid grid-cols-2 gap-4">
            {chefs.map((chef) => (
              <div
                key={chef.staff_id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <h3 className="font-semibold">Chef ID: {chef.staff_id}</h3>
                <p className="text-sm text-gray-700">
                  Description: {chef.description}
                </p>
                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() =>
                      navigate(`/staff/fnbm/updatechef/${chef.staff_id}`)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      invoke("delete_chef_assignment", {
                        staffId: chef.staff_id,
                      })
                        .then(() => {
                          toast.success("Deleted chef!");
                          fetchAssignments();
                        })
                        .catch((err) => toast.error(err as string));
                      fetchStatus();
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white w-6xl mt-10 shadow-md rounded-md">
          <h2 className="text-2xl font-bold text-center">Assigned Waiters</h2>
          <button
            className="bg-blue-500 px-4 py-2 rounded-md text-white mb-4"
            onClick={() => navigate(`/staff/fnbm/allocatewaiter/${id}`)}
          >
            Allocate Waiter
          </button>
          <div className="grid grid-cols-2 gap-4">
            {waiters.map((waiter) => (
              <div
                key={waiter.staff_id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <h3 className="font-semibold">Waiter ID: {waiter.staff_id}</h3>
                <p className="text-sm text-gray-700">
                  Description: {waiter.description}
                </p>
                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() =>
                      navigate(`/staff/fnbm/updatechef/${waiter.staff_id}`)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      invoke("delete_waiter_assignment", {
                        staffId: waiter.staff_id,
                      })
                        .then(() => {
                          toast.success("Deleted chef!");
                          fetchAssignments();
                        })
                        .catch((err) => toast.error(err as string));
                      fetchStatus();
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
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

export default ViewRestaurantDetail;
