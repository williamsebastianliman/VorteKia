import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import RDMNavigationBar from "../../components/RDMNavigationBar";

type ChatOA = {
  chat_id: number;
  sender_staff_id: string;
  message: string;
  timestamp: string;
  is_reply: number;
};

function RequestMaintenance() {
  const [staffId, setStaffId] = useState("");
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<ChatOA[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const GROUP_ID = "GC002";

  async function fetchLoggedInStaff() {
    try {
      const id: string = await invoke("get_logged_in_staff");
      setStaffId(id);
    } catch {
      toast.error("Failed to verify staff login.");
    }
  }

  async function fetchChats() {
    try {
      const data: ChatOA[] = await invoke("get_all_chat_oa_by_real_group", {
        groupId: GROUP_ID,
      });
      const filtered = data.filter(
        (m) =>
          m.sender_staff_id === staffId ||
          (m.is_reply === 1 && m.sender_staff_id === staffId)
      );
      filtered.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      setChats(filtered);
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function sendMessage() {
    if (!message.trim()) return;
    if (message.length > 100) {
      toast.error("Message cannot exceed 100 characters.");
      return;
    }

    try {
      await invoke("insert_new_chat_oa", {
        senderStaffId: staffId,
        groupId: GROUP_ID,
        message: message.trim(),
        isReply: 0,
      });
      setMessage("");
      await fetchChats();
    } catch (err) {
      toast.error(err as string);
    }
  }

  useEffect(() => {
    fetchLoggedInStaff();
  }, []);

  useEffect(() => {
    if (staffId) {
      fetchChats();
      const interval = setInterval(fetchChats, 500);
      return () => clearInterval(interval);
    }
  }, [staffId]);

  useEffect(() => {
    if (chats.length > 0) {
      const timeout = setTimeout(() => {
        chatEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [chats]);

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <Toaster />
      <RDMNavigationBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chats.map((chat) => (
            <div
              key={chat.chat_id}
              className={`max-w-[60%] p-3 rounded-lg mb-2 ${
                chat.is_reply
                  ? "mr-auto bg-white text-left"
                  : "ml-auto bg-blue-100 text-right"
              }`}
            >
              <div className="break-words">{chat.message}</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTime(chat.timestamp)}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t bg-white flex gap-2 sticky bottom-0 z-10">
          <input
            type="text"
            value={message}
            maxLength={100}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestMaintenance;
