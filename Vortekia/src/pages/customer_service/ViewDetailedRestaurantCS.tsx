import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import CSNavigationBar from "../../components/CSNavigationBar";

type Restaurant = {
  restaurant_id: string;
  restaurant_name: string;
  restaurant_description: string;
  restaurant_image: string;
  restaurant_location: string;
  restaurant_open_time: string;
  restaurant_close_time: string;
};
function ViewDetailedRestaurantCS() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  async function fetchRestaurants() {
    try {
      const data: Restaurant[] = await invoke("get_all_restaurants");
      setRestaurants(data);
    } catch (error) {
      toast.error(error as string);
    }
  }

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div>
      <Toaster />
      <CSNavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-12 underline">Restaurants</h1>

        <div className="flex flex-col gap-6 items-center justify-center">
          {restaurants.map((restaurant) => (
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
              <p className="text-gray-600">
                {`${restaurant.restaurant_open_time}-${restaurant.restaurant_close_time}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ViewDetailedRestaurantCS;
