import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import FNBMNavigationBar from "../../components/FNBMNavigationBar";

type Restaurant = {
  restaurant_id: string;
  restaurant_name: string;
  restaurant_description: string;
  restaurant_image: string;
  restaurant_location: string;
  restaurant_open_time: string;
  restaurant_close_time: string;
};

type StatusMap = {
  [id: string]: boolean;
};

function ViewRestaurant() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  async function fetchRestaurants() {
    try {
      const data: Restaurant[] = await invoke("get_all_restaurants");
      setRestaurants(data);
      setFilteredRestaurants(data);
      fetchStatus(data);
    } catch (error) {
      toast.error(error as string);
    }
  }

  async function fetchStatus(data: Restaurant[]) {
    const status: StatusMap = {};
    for (const r of data) {
      try {
        const isOpen: boolean = await invoke("is_restaurant_open", {
          id: r.restaurant_id,
        });
        status[r.restaurant_id] = isOpen;
      } catch (error) {
        status[r.restaurant_id] = false;
      }
    }
    setStatusMap(status);
  }

  async function handleDelete(id: string) {
    try {
      await invoke("delete_restaurant_by_id", { id });
      toast.success("Restaurant deleted successfully!");
      fetchRestaurants();
    } catch (error) {
      toast.error(error as string);
    }
  }

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (filter === "All") {
      setFilteredRestaurants(restaurants);
    } else {
      const isOpen = filter === "Open";
      const filtered = restaurants.filter(
        (r) => statusMap[r.restaurant_id] === isOpen
      );
      setFilteredRestaurants(filtered);
    }
  }, [filter, statusMap, restaurants]);

  return (
    <div>
      <Toaster />
      <FNBMNavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-12 underline">Restaurants</h1>

        <div className="mb-6">
          <label className="mr-2 font-semibold">Filter by Status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="All">None</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="flex flex-col gap-6 items-center justify-center">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.restaurant_id}
              className="bg-white shadow-md rounded-lg p-4 w-4xl flex gap-5 flex-col"
            >
              <div className="w-full h-48 bg-gray-200 rounded-lg">
                {restaurant.restaurant_image ? (
                  <img
                    src={`../../${restaurant.restaurant_image}`}
                    alt={restaurant.restaurant_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p>No Image</p>
                )}
              </div>

              <h2 className="text-xl font-semibold mt-2">
                {restaurant.restaurant_name}
              </h2>
              <p className="text-gray-600">
                {restaurant.restaurant_description}
              </p>
              <p className="text-gray-600">{`${restaurant.restaurant_open_time} - ${restaurant.restaurant_close_time}`}</p>
              <p
                className={`font-bold ${
                  statusMap[restaurant.restaurant_id]
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Status:{" "}
                {statusMap[restaurant.restaurant_id] ? "Open" : "Closed"}
              </p>
              <div className="flex col-auto gap-5 mt-2">
                <button
                  className="bg-blue-500 rounded text-white px-2 py-1"
                  onClick={() =>
                    navigate(
                      `/staff/fnbm/restaurant/${restaurant.restaurant_id}`
                    )
                  }
                >
                  View Detail
                </button>
                <button
                  className="bg-red-600 rounded text-white px-2 py-1"
                  onClick={() => handleDelete(restaurant.restaurant_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewRestaurant;
