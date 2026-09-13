import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CCNavigationBar from "../../../components/CCNavigationBar";

type Notification = {
  notification_id: number;
  customer_id: string;
  message: string;
};

function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  async function fetchNotifications() {
    try {
      const customerId: string = await invoke("get_logged_in_customer");
      const result: Notification[] = await invoke(
        "get_all_notifications_by_customer",
        {
          customerId: customerId,
        }
      );
      setNotifications(result);
    } catch (err) {
      toast.error(err as string);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <Toaster />
      <CCNavigationBar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-black text-center mb-8 underline">
          Your Notifications
        </h1>
        <div className="space-y-4 max-w-4xl mx-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">No notifications found.</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.notification_id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <p className="text-black font-medium">{notif.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationPage;
