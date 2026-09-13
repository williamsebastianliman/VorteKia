import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router";
import CSTNavigationBar from "../../../components/CSTNavigationBar";

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
  souvenir_price: number;
  souvenir_stock: number;
  souvenir_image: string;
};

function ViewStoreCustomer() {
  const { id } = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [filteredSouvenirs, setFilteredSouvenirs] = useState<Souvenir[]>([]);
  const [search, setSearch] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<Souvenir[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [login, setLogin] = useState(false);

  async function checkLoginStatus() {
    try {
      const result: boolean = await invoke("check_customer_login");
      if (result) {
        const id: string = await invoke("get_logged_in_customer");
        setCustomerId(id);
      }
      setLogin(result);
    } catch (_) {
      setLogin(false);
    }
  }

  async function fetchStore() {
    try {
      const result: Store = await invoke("get_store_by_id", { id });
      setStore(result);
    } catch (err) {
      toast.error("Failed to fetch store");
    }
  }

  async function fetchSouvenirs() {
    try {
      const result: Souvenir[] = await invoke("get_all_souvenirs_by_store", {
        id,
      });
      setSouvenirs(result);
      setFilteredSouvenirs(result);
    } catch (err) {
      toast.error("Failed to load souvenirs");
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setFilteredSouvenirs(
      souvenirs.filter((s) =>
        s.souvenir_name.toLowerCase().startsWith(value.toLowerCase())
      )
    );
  }

  function toggleCart() {
    setIsCartOpen(!isCartOpen);
  }

  function addQuantity(item: Souvenir) {
    setCart((prev) => {
      const index = prev.findIndex((i) => i.souvenir_id === item.souvenir_id);
      if (index !== -1) {
        setQuantities((prevQty) =>
          prevQty.map((q, i) => (i === index ? q + 1 : q))
        );
        return prev;
      } else {
        setQuantities((prevQty) => [...prevQty, 1]);
        return [...prev, item];
      }
    });
  }

  function removeQuantity(item: Souvenir) {
    setCart((prev) => {
      const index = prev.findIndex((i) => i.souvenir_id === item.souvenir_id);
      if (index !== -1) {
        const updatedQuantities = [...quantities];
        updatedQuantities[index] -= 1;

        if (updatedQuantities[index] <= 0) {
          setQuantities((prevQty) => prevQty.filter((_, i) => i !== index));
          return prev.filter((_, i) => i !== index);
        }

        setQuantities(updatedQuantities);
      }
      return prev;
    });
  }

  function calculateGrandTotal() {
    return cart.reduce(
      (total, item, i) => total + item.souvenir_price * quantities[i],
      0
    );
  }

  async function handleCheckout() {
    try {
      const grandTotal = Math.floor(calculateGrandTotal());

      await invoke("deduct_customer_balance", {
        customerId,
        amount: grandTotal,
      });
      console.log("Cart: " + cart[0].souvenir_price);
      const transactionId: string = await invoke(
        "insert_new_transaction_store",
        {
          souvenirs: cart,
          quantity: quantities,
          customerId,
          storeId: id,
        }
      );

      setCart([]);
      setQuantities([]);
      toast.success("Successfully ordered souvenirs!");
    } catch (err) {
      const errorStr = err as string;
      if (errorStr.toLowerCase().includes("insufficient")) {
        toast.error("Insufficient balance.");
      } else {
        toast.error(err as string);
      }
    }
  }

  useEffect(() => {
    checkLoginStatus();
    fetchStore();
    fetchSouvenirs();
  }, []);

  return (
    <div>
      <Toaster />
      <CSTNavigationBar />
      <div className="flex flex-col bg-gray-100 min-h-screen items-center">
        <div className="p-6 bg-white w-6xl mt-32 shadow-md rounded-md">
          <h2 className="text-2xl font-bold text-center">
            Store: {store?.store_name}
          </h2>

          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search souvenirs..."
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
            {filteredSouvenirs.map((s) => {
              const index = cart.findIndex(
                (c) => c.souvenir_id === s.souvenir_id
              );
              const quantity = quantities[index] || 0;

              return (
                <div
                  key={s.souvenir_id}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                    {s.souvenir_image ? (
                      <img
                        src={`../../${s.souvenir_image}`}
                        alt={s.souvenir_image}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <p className="text-gray-500 text-center mt-16">
                        No Image
                      </p>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold">{s.souvenir_name}</h2>
                  <p className="text-gray-600 text-sm">
                    {s.souvenir_description}
                  </p>
                  <p className="text-black font-semibold mt-2">
                    Price: {s.souvenir_price}
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      className={`bg-blue-600 text-white w-8 h-8 rounded ${
                        !login ? "opacity-0 cursor-not-allowed" : ""
                      }`}
                      onClick={() => removeQuantity(s)}
                    >
                      -
                    </button>
                    <span className="text-center font-semibold">
                      Qty: {quantity}
                    </span>
                    <button
                      className={`bg-blue-600 text-white w-8 h-8 rounded ${
                        !login ? "opacity-0 cursor-not-allowed" : ""
                      }`}
                      onClick={() => addQuantity(s)}
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
              <ul className="mt-4 space-y-2">
                {cart.map((c, i) => (
                  <li
                    key={c.souvenir_id}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <span className="font-medium">{c.souvenir_name}</span>
                    <span>x {quantities[i]}</span>
                    <span>{c.souvenir_price * quantities[i]}</span>
                  </li>
                ))}
              </ul>
              <h2 className="text-1xl font-bold mt-3">
                Grand Total: {calculateGrandTotal()}
              </h2>
              <button
                className="bg-blue-600 rounded text-white px-2 py-1 mt-4"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStoreCustomer;
