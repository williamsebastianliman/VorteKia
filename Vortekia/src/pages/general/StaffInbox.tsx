import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

type Broadcast = {
  broadcast_id: number;
  broadcast_type: string;
  broadcast_message: string;
  timestamp: string;
};

function StaffInbox() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  async function fetchBroadcasts() {
    try {
      const result: Broadcast[] = await invoke("get_all_broadcast_by_type", {
        bType: "Staff",
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
      <Toaster />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Staff Inbox</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Back
          </button>
        </div>
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

export default StaffInbox;
