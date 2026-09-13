import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CCNavigationBar from "../../../components/CCNavigationBar";

type Broadcast = {
  broadcast_id: number;
  broadcast_type: string;
  broadcast_message: string;
  timestamp: string;
};

function CustomerInbox() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  async function fetchBroadcasts() {
    try {
      const result: Broadcast[] = await invoke("get_all_broadcast_by_type", {
        bType: "Customer",
      });
      setBroadcasts(result);
    } catch (err) {
      toast.error("Failed to fetch broadcasts.");
    }
  }

  function formatTimestamp(ts: string) {
    const date = new Date(ts);
    return date.toLocaleString();
  }

  return (
    <div>
      <CCNavigationBar />
      <Toaster />
      <div className="bg-gray-100 min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">Inbox</h1>
        <div className="space-y-4">
          {broadcasts.map((item) => (
            <div
              key={item.broadcast_id}
              className="bg-white w-full rounded-lg shadow p-4"
            >
              <div className="text-sm text-gray-500 mb-1">
                {formatTimestamp(item.timestamp)}
              </div>
              <div className="text-gray-800">{item.broadcast_message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerInbox;
