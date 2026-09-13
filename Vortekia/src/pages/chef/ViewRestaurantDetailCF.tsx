import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import FNBMNavigationBar from "../../components/FNBMNavigationBar";
import CFNavigationBar from "../../components/CFNavigationBar";

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

function ViewRestaurantDetailCF() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  async function fetchRestaurantData() {
    try {
      const staffId: string = await invoke("get_logged_in_staff");
      const assignment: { restaurant_id: string } | null = await invoke(
        "get_chef_assignment_by_staff",
        {
          staffId: staffId,
        }
      );

      if (!assignment || !assignment.restaurant_id) {
        toast.error("No restaurant assigned.");
        return;
      }

      const restaurant: Restaurant = await invoke("get_restaurant_by_id", {
        id: assignment.restaurant_id,
      });
      setRestaurant(restaurant);

      const menuData: Menu[] = await invoke("get_all_menu_by_restaurant", {
        id: assignment.restaurant_id,
      });
      setMenus(menuData);

      const status: boolean = await invoke("is_restaurant_open", {
        id: assignment.restaurant_id,
      });
      setIsOpen(status);
    } catch (error) {
      toast.error(error as string);
    }
  }

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  return (
    <div>
      <Toaster />
      <CFNavigationBar />
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
              <h2 className="text-center font-bold text-2xl">
                Restaurant Details
              </h2>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Name:</strong> {restaurant.restaurant_name}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {restaurant.restaurant_description}
                </p>
                <p>
                  <strong>Open Time:</strong> {restaurant.restaurant_open_time}
                </p>
                <p>
                  <strong>Close Time:</strong>{" "}
                  {restaurant.restaurant_close_time}
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
              <h2 className="text-2xl font-bold text-center">All Menu</h2>
              <div className="grid grid-cols-4 gap-6">
                {menus.map((menu) => (
                  <div
                    key={menu.menu_id}
                    className="bg-white shadow-md rounded-lg p-4"
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
                    <h2 className="text-xl font-semibold mt-2">
                      {menu.menu_name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {menu.menu_description}
                    </p>
                    <p className="text-black mt-2.5">
                      Price: {menu.menu_price}
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
export default ViewRestaurantDetailCF;
