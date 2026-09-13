import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CRNavigationBar from "../../../components/CRNavigationBar";

type Restaurant = {
  restaurant_id: string;
  restaurant_name: string;
  restaurant_description: string;
  restaurant_image: string;
  restaurant_open_time: string;
  restaurant_close_time: string;
};

function ViewRestaurantDetailCustomer() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  async function fetchRestaurantDetail() {
    try {
      const result: Restaurant = await invoke("get_restaurant_by_id", { id });
      setRestaurant(result);
    } catch (error) {
      toast.error("Failed to load restaurant details.");
    }
  }

  async function fetchRestaurantStatus() {
    try {
      const status: boolean = await invoke("is_restaurant_open", { id });
      setIsOpen(status);
    } catch (_) {
      setIsOpen(null);
    }
  }

  useEffect(() => {
    fetchRestaurantDetail();
    fetchRestaurantStatus();

    const interval = setInterval(fetchRestaurantStatus, 1000);

    return () => clearInterval(interval);
  }, [id]);

  return (
    <div>
      <Toaster />
      <CRNavigationBar />
      <div className="flex flex-col bg-gray-100 min-h-screen items-center">
        {restaurant && (
          <>
            <div className="w-full h-64 relative">
              <img
                src={`../../${restaurant.restaurant_image}`}
                alt="Restaurant Banner"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 bg-white w-3xl mt-6 shadow-md rounded-md">
              <h2 className="text-center font-bold text-2xl mb-4">
                Restaurant Details
              </h2>

              <div className="space-y-4">
                <div>
                  <span className="block font-semibold text-gray-700">
                    Name:
                  </span>
                  <p className="text-gray-900">{restaurant.restaurant_name}</p>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">
                    Description:
                  </span>
                  <p className="text-gray-900">
                    {restaurant.restaurant_description}
                  </p>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">
                    Open Time:
                  </span>
                  <p className="text-gray-900">
                    {restaurant.restaurant_open_time}
                  </p>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">
                    Close Time:
                  </span>
                  <p className="text-gray-900">
                    {restaurant.restaurant_close_time}
                  </p>
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

export default ViewRestaurantDetailCustomer;
