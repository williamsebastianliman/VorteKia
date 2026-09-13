import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CFNavigationBar from "../../components/CFNavigationBar";

type Order = {
  order_id: number;
  transaction_id: string;
  staff_id: string | null;
  status: string;
};

type OrderMenuDetail = {
  menu_name: string;
  quantity: number;
};

function ChefOrderView() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [waitingOrders, setWaitingOrders] = useState<Order[]>([]);
  const [cookingOrders, setCookingOrders] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<
    Record<string, OrderMenuDetail[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignment();
  }, []);

  useEffect(() => {
    if (restaurantId && staffId) {
      fetchOrders();
    }
  }, [restaurantId, staffId]);

  async function fetchAssignment() {
    setLoading(true);
    try {
      const staff: string = await invoke("get_logged_in_staff");
      setStaffId(staff);
      const assignment: { restaurant_id: string } = await invoke(
        "get_chef_assignment_by_staff",
        { staffId: staff }
      );
      setRestaurantId(assignment.restaurant_id);
    } catch (err) {
      toast.error("You have not been assigned to any restaurant.");
      setRestaurantId(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    try {
      const waiting: Order[] = await invoke(
        "get_orders_by_restaurant_staff_status",
        {
          restaurantId,
          staffId,
          status: "Waiting Chef",
        }
      );

      const cooking: Order[] = await invoke(
        "get_orders_by_restaurant_staff_status",
        {
          restaurantId,
          staffId,
          status: "Cooking",
        }
      );

      setWaitingOrders(waiting);
      setCookingOrders(cooking);

      const allOrders = [...waiting, ...cooking];
      const newDetails: Record<string, OrderMenuDetail[]> = {};

      for (const order of allOrders) {
        const detailList: { menu_history_id: string; quantity: number }[] =
          await invoke("get_restaurant_transaction_detail_by_header", {
            id: order.transaction_id,
          });

        const detailWithNames: OrderMenuDetail[] = [];

        for (const detail of detailList) {
          const menus: { menu_name: string }[] = await invoke(
            "get_all_menu_by_history_id",
            {
              historyId: detail.menu_history_id,
            }
          );

          if (menus.length > 0) {
            detailWithNames.push({
              menu_name: menus[0].menu_name,
              quantity: detail.quantity,
            });
          }
        }

        newDetails[order.transaction_id] = detailWithNames;
      }

      setOrderDetails(newDetails);
    } catch (err) {
      toast.error("Failed to fetch chef orders.");
    }
  }

  async function handleUpdateStatus(orderId: number, newStatus: string) {
    try {
      await invoke("update_order_status_and_staff", {
        orderId,
        newStatus,
        staffId,
      });
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order.");
    }
  }

  const renderOrderCard = (
    order: Order,
    buttonLabel: string,
    nextStatus: string,
    buttonColor: string
  ) => (
    <div key={order.order_id} className="bg-white border shadow rounded p-5">
      <h4 className="text-xl font-bold mb-2">Order #{order.order_id}</h4>
      <p>
        <strong>Transaction ID:</strong> {order.transaction_id}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>

      <div className="mt-2 text-sm">
        <strong>Items:</strong>
        <ul className="list-disc ml-5 mt-1 text-gray-700">
          {orderDetails[order.transaction_id]?.map((item, idx) => (
            <li key={idx}>
              {item.menu_name} × {item.quantity}
            </li>
          )) ?? <li>Loading...</li>}
        </ul>
      </div>

      <button
        className={`mt-4 w-full ${buttonColor} text-white py-2 rounded hover:opacity-90`}
        onClick={() => handleUpdateStatus(order.order_id, nextStatus)}
      >
        {buttonLabel}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black">
      <Toaster />
      <CFNavigationBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Chef Orders</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : !restaurantId ? (
          <div className="text-red-600 text-center text-lg font-semibold border border-red-300 p-6 rounded-lg">
            You have not been assigned to a restaurant.
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Waiting Chef
              </h3>
              {waitingOrders.length === 0 ? (
                <div className="text-gray-500 border rounded p-4 text-center">
                  No orders waiting to be cooked.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {waitingOrders.map((order) =>
                    renderOrderCard(order, "Cook", "Cooking", "bg-blue-600")
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Currently Cooking
              </h3>
              {cookingOrders.length === 0 ? (
                <div className="text-gray-500 border rounded p-4 text-center">
                  No orders currently being cooked.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cookingOrders.map((order) =>
                    renderOrderCard(
                      order,
                      "Done",
                      "Ready to Serve",
                      "bg-green-600"
                    )
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChefOrderView;
