import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import CCNavigationBar from "../../../components/CCNavigationBar";
import { useNavigate } from "react-router";

type Restaurant = {
  restaurant_id: string;
  restaurant_name: string;
  restaurant_description: string;
  restaurant_image: string;
  restaurant_location: string;
  restaurant_open_time: string;
  restaurant_close_time: string;
};

function ViewRestaurantsCustomer() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [searchField, setSearchField] = useState("name");
  const [query, setQuery] = useState("");

  async function fetchRestaurants() {
    try {
      const data: Restaurant[] = await invoke("get_all_restaurants");
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (error) {
      toast.error(error as string);
    }
  }

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    const result = restaurants.filter((res) => {
      if (searchField === "name") {
        return res.restaurant_name.toLowerCase().includes(lowerQuery);
      } else {
        return res.restaurant_description.toLowerCase().includes(lowerQuery);
      }
    });
    setFilteredRestaurants(result);
  }, [query, searchField, restaurants]);

  return (
    <div>
      <CCNavigationBar />
      <Toaster />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 underline">Restaurants</h1>

        <div className="flex gap-4 mb-10 items-center">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="name">Search by Name</option>
            <option value="cuisine">Search by Cuisine</option>
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search by ${searchField}`}
            className="border px-4 py-2 rounded w-80"
          />
        </div>

        <div className="flex flex-col gap-6 items-center justify-center">
          {filteredRestaurants.length === 0 && (
            <p className="text-gray-500">No restaurants match your search.</p>
          )}
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.restaurant_id}
              className="bg-white shadow-md rounded-lg p-4 w-4xl flex gap-5 flex-col"
            >
              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                {restaurant.restaurant_image ? (
                  <img
                    src={`../../${restaurant.restaurant_image}`}
                    alt={restaurant.restaurant_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-center text-gray-400 mt-16">No Image</p>
                )}
              </div>

              <h2 className="text-xl font-semibold">
                {restaurant.restaurant_name}
              </h2>
              <p className="text-gray-600">
                {restaurant.restaurant_description}
              </p>
              <p className="text-gray-600">
                {`${restaurant.restaurant_open_time} - ${restaurant.restaurant_close_time}`}
              </p>
              <button
                className="bg-blue-500 rounded text-white px-2 py-1"
                onClick={() =>
                  navigate(
                    `/customer/customer/menu/${restaurant.restaurant_id}`
                  )
                }
              >
                View Detail
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewRestaurantsCustomer;
