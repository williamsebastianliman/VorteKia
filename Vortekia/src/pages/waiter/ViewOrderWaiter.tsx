import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import WTNavigationBar from "../../components/WTNavigationBar";

type Order = {
  order_id: number;
  transaction_id: string;
  staff_id: string | null;
  status: string;
};

type Chef = {
  staff_id: string;
  description: string;
};

type MenuDetail = {
  name: string;
  quantity: number;
};

function ViewOrderWaiter() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuDetailsMap, setMenuDetailsMap] = useState<{
    [orderId: number]: MenuDetail[];
  }>({});

  useEffect(() => {
    fetchAssignedRestaurantId();
  }, []);

  useEffect(() => {
    if (restaurantId) {
      fetchOrders();
      fetchChefs();
    }
  }, [restaurantId]);

  async function fetchAssignedRestaurantId() {
    setLoading(true);
    try {
      const staffId: string = await invoke("get_logged_in_staff");
      const assignment: { restaurant_id: string } = await invoke(
        "get_waiter_assignment_by_staff",
        { staffId }
      );
      setRestaurantId(assignment.restaurant_id);
    } catch {
      toast.error("You are not assigned to any restaurant.");
      setRestaurantId(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    try {
      const pending: Order[] = await invoke(
        "get_orders_by_restaurant_and_status",
        { restaurantId, status: "Pending" }
      );
      const ready: Order[] = await invoke(
        "get_orders_by_restaurant_and_status",
        { restaurantId, status: "Ready to Serve" }
      );

      setPendingOrders(pending);
      setReadyOrders(ready);

      pending.forEach((order) =>
        fetchMenuDetails(order.transaction_id, order.order_id)
      );
      ready.forEach((order) =>
        fetchMenuDetails(order.transaction_id, order.order_id)
      );
    } catch {
      toast.error("Failed to fetch orders.");
    }
  }

  async function fetchChefs() {
    try {
      const data: Chef[] = await invoke("get_chefs_by_restaurant", {
        restaurantId,
      });
      setChefs(data);
    } catch {
      toast.error("Failed to fetch chefs.");
    }
  }

  async function fetchMenuDetails(transactionId: string, orderId: number) {
    try {
      const details = await invoke(
        "get_restaurant_transaction_detail_by_header",
        {
          id: transactionId,
        }
      );

      const detailList = await Promise.all(
        (details as any[]).map(async (detail) => {
          const menus = await invoke("get_all_menu_by_history_id", {
            historyId: detail.menu_history_id,
          });
          const menu = (menus as any[])[0];
          return {
            name: menu?.menu_name ?? "Unknown",
            quantity: detail.quantity,
          };
        })
      );

      setMenuDetailsMap((prev) => ({
        ...prev,
        [orderId]: detailList,
      }));
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function handleAssignChef(orderId: number, chefId: string) {
    try {
      await invoke("update_order_status_and_staff", {
        orderId,
        newStatus: "Waiting Chef",
        staffId: chefId,
      });
      toast.success("Chef assigned!");
      fetchOrders();
    } catch {
      toast.error("Failed to assign chef.");
    }
  }

  async function handleServeFood(orderId: number) {
    try {
      await invoke("update_order_status_and_staff", {
        orderId,
        newStatus: "Complete",
        staffId: null,
      });
      toast.success("Food served!");
      fetchOrders();
    } catch {
      toast.error("Failed to complete order.");
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Toaster />
      <WTNavigationBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Waiter Orders</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : !restaurantId ? (
          <div className="text-red-600 text-center text-lg font-semibold border border-red-300 p-6 rounded-lg">
            You are not assigned to any restaurant.
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Pending Orders
              </h3>
              {pendingOrders.length === 0 ? (
                <div className="text-gray-500 border rounded p-4 text-center">
                  No pending orders.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingOrders.map((order) => (
                    <div
                      key={order.order_id}
                      className="bg-white border shadow rounded p-5"
                    >
                      <h4 className="text-xl font-bold mb-2">
                        Order #{order.order_id}
                      </h4>
                      <p>
                        <strong>Transaction ID:</strong> {order.transaction_id}
                      </p>
                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>
                      {menuDetailsMap[order.order_id]?.map((item, idx) => (
                        <p key={idx}>
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">
                          Assign Chef
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          defaultValue=""
                          onChange={(e) => {
                            const chefId = e.target.value;
                            if (chefId)
                              handleAssignChef(order.order_id, chefId);
                          }}
                        >
                          <option value="">-- Select Chef --</option>
                          {chefs.map((chef) => (
                            <option key={chef.staff_id} value={chef.staff_id}>
                              {chef.staff_id}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Ready to Serve Orders
              </h3>
              {readyOrders.length === 0 ? (
                <div className="text-gray-500 border rounded p-4 text-center">
                  No ready-to-serve orders.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {readyOrders.map((order) => (
                    <div
                      key={order.order_id}
                      className="bg-white border shadow rounded p-5"
                    >
                      <h4 className="text-xl font-bold mb-2">
                        Order #{order.order_id}
                      </h4>
                      <p>
                        <strong>Transaction ID:</strong> {order.transaction_id}
                      </p>
                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>
                      {menuDetailsMap[order.order_id]?.map((item, idx) => (
                        <p key={idx}>
                          🍽️ {item.name} × {item.quantity}
                        </p>
                      ))}
                      <button
                        className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                        onClick={() => handleServeFood(order.order_id)}
                      >
                        Serve Food
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ViewOrderWaiter;
