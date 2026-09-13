import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CSNavigationBar from "../../components/CSNavigationBar";
import { invoke } from "@tauri-apps/api/core";

function CreateBroadcastMessage() {
  const [broadcastType, setBroadcastType] = useState("Customer");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    console.log("type:", broadcastType);
    console.log("msg:", message);
    try {
      await invoke("insert_broadcast", {
        broadcastType: broadcastType,
        broadcastMessage: message,
      });

      toast.success("Broadcast sent!");
    } catch (err) {
      toast.error(err as string);
    }

    setBroadcastType("Customer");
    setMessage("");
  };

  return (
    <div>
      <CSNavigationBar />
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <Toaster />
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Create Broadcast Message
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm text-black font-medium">
                Broadcast Type
              </label>
              <select
                className="w-full px-4 py-2 border rounded-md"
                value={broadcastType}
                onChange={(e) => setBroadcastType(e.target.value)}
              >
                <option value="Customer">Customer</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-black font-medium">
                Message
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-md resize-none"
                placeholder="Enter broadcast message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            <button
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              onClick={handleSubmit}
            >
              Send Broadcast
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBroadcastMessage;
