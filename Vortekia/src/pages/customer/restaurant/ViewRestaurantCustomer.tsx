import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router";
import CRNavigationBar from "../../../components/CRNavigationBar";

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
  menu_price: number;
  menu_image: string;
  menu_history_id: string;
};

function ViewRestaurantCustomer() {
  const { id } = useParams();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
  const [search, setSearch] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCarts] = useState<Menu[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [login, setLogin] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState("");

  async function checkLoginStatus() {
    try {
      const response: boolean = await invoke("check_customer_login");
      if (response === true) {
        const id: string = await invoke("get_logged_in_customer");
        setCustomerId(id);
      }
      setLogin(response);
    } catch (error) {
      setLogin(false);
    }
  }

  function toggleCart() {
    setIsCartOpen(!isCartOpen);
  }

  function addQuantity(obj: Menu) {
    setCarts((prevCarts) => {
      const existingIndex = prevCarts.findIndex(
        (menu) => menu.menu_id === obj.menu_id
      );

      if (existingIndex !== -1) {
        setQuantities((prevQuantities) =>
          prevQuantities.map((q, index) =>
            index === existingIndex ? q + 1 : q
          )
        );
        return prevCarts;
      } else {
        setQuantities((prevQuantities) => [...prevQuantities, 1]);
        return [...prevCarts, obj];
      }
    });
  }

  function removeQuantity(obj: Menu) {
    setCarts((prevCarts) => {
      const existingIndex = prevCarts.findIndex(
        (menu) => menu.menu_id === obj.menu_id
      );

      if (existingIndex !== -1) {
        setQuantities((prevQuantities) => {
          const updatedQuantities = prevQuantities.map((q, index) =>
            index === existingIndex ? q - 1 : q
          );

          if (updatedQuantities[existingIndex] <= 0) {
            return updatedQuantities.filter(
              (_, index) => index !== existingIndex
            );
          }

          return updatedQuantities;
        });

        if ((quantities[existingIndex] || 0) - 1 <= 0) {
          return prevCarts.filter((_, index) => index !== existingIndex);
        }
      }
      return prevCarts;
    });
  }

  function calculateGrandTotal() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      const price = parseInt(cart[i].menu_price.toString());
      const qty = quantities[i];
      total += price * qty;
    }
    return total;
  }

  async function handleCheckout(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      const grandTotal = Math.floor(calculateGrandTotal());

      await invoke("deduct_customer_balance", {
        customerId: customerId,
        amount: grandTotal,
      });

      const transactionId: string = await invoke("insert_new_transaction", {
        menus: cart,
        quantity: quantities,
        customerId: customerId,
        restaurantId: id,
      });
      console.log("id: " + transactionId);

      await invoke("insert_order_by_customer", {
        transactionId: transactionId,
      });

      setCarts([]);
      setQuantities([]);
      toast.success("Successfully ordered food!");
    } catch (error) {
      const err = error as string;
      if (err.toLowerCase().includes("insufficient")) {
        toast.error("Insufficient balance. Please top up.");
      } else {
        toast.error("Checkout failed: " + err);
      }
    }
  }

  async function fetchAllMenu() {
    try {
      const data: Menu[] = await invoke("get_all_menu_by_restaurant", { id });
      setMenus(data);
      setFilteredMenus(data);
    } catch (error) {
      toast.error(error as string);
    }
  }

  async function getRestaurantName() {
    const data: Restaurant = await invoke("get_restaurant_by_id", { id });
    setRestaurantName(data.restaurant_name);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setFilteredMenus(
      menus.filter((menu) =>
        menu.menu_name.toLowerCase().startsWith(value.toLowerCase())
      )
    );
  }

  useEffect(() => {
    checkLoginStatus();
    fetchAllMenu();
    getRestaurantName();
  }, []);

  return (
    <div>
      <Toaster />
      <CRNavigationBar />
      <div className="flex flex-col bg-gray-100 min-h-screen items-center">
        <div className="p-6 bg-white w-6xl mt-32 shadow-md rounded-md">
          <h2 className="text-1xl font-bold">Restaurant: {restaurantName}</h2>
          <h2 className="text-2xl font-bold text-center">All Menu</h2>

          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search menu by name..."
            className="mb-4 mt-2 w-full px-4 py-2 border rounded-md"
          />

          <button
            className={`bg-blue-600 rounded text-white px-2 py-1 mb-4 ${
              !login ? "opacity-0 cursor-not-allowed" : ""
            }`}
            onClick={toggleCart}
          >
            View Cart
          </button>

          <div className="grid grid-cols-4 gap-6">
            {filteredMenus.map((menu) => {
              const quantity =
                quantities.find((_, i) => cart[i].menu_id === menu.menu_id) ||
                0;
              return (
                <div
                  key={menu.menu_id}
                  className="bg-white shadow-md rounded-lg p-4 relative"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden ">
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
                  <p className="text-black mt-2.5 mb-18">
                    Price: {menu.menu_price}
                  </p>
                  <div className="flex row-auto gap-5 mt-2 items-center absolute bottom-7 left-1/2 -translate-x-1/2 justify-center align-middle ">
                    <button
                      className={`bg-blue-600 rounded text-white px-2 py-1 w-8 h-8 ${
                        !login ? "opacity-0 cursor-not-allowed" : ""
                      }`}
                      onClick={() => removeQuantity(menu)}
                    >
                      -
                    </button>
                    <label
                      className={`w-25 text-center ${
                        !login ? "opacity-0 cursor-not-allowed" : ""
                      }`}
                    >
                      Quantity: {quantity}
                    </label>
                    <button
                      className={`bg-blue-600 rounded text-white px-2 py-1 w-8 h-8 ${
                        !login ? "opacity-0 cursor-not-allowed" : ""
                      }`}
                      onClick={() => addQuantity(menu)}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-md transform transition-transform duration-300 ${
              isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <button
              className="absolute top-4 right-4 bg-white rounded px-2 py-1"
              onClick={toggleCart}
            >
              X
            </button>
            <div className="p-4 mt-12">
              <h2 className="text-xl font-bold mb-4">Your Cart</h2>
              <ul className="mt-4 space-y-2 relative">
                {cart.map((c, index) => (
                  <li
                    key={c.menu_id}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <span className="font-medium">{c.menu_name}</span>
                    <span className="text-gray-600 text-right absolute right-20">
                      x {quantities[index] || 0}
                    </span>
                    <span className="text-gray-600 text-right">
                      {quantities[index] * c.menu_price || 0}
                    </span>
                  </li>
                ))}
              </ul>
              <h2 className="text-1xl font-bold mt-3">
                Grand Total:{" "}
                {cart.reduce((sum, c, index) => {
                  return sum + c.menu_price * quantities[index];
                }, 0)}
              </h2>
              <button
                className=" bg-blue-600 rounded text-white px-2 py-1 mt-4"
                onClick={handleCheckout}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
}

export default ViewRestaurantCustomer;
