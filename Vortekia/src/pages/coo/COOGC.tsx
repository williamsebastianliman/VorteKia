import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import COONavigationBar from "../../components/COONavigationBar";

type Chat = {
  chat_id: string;
  sender_staff_id: string;
  message: string;
  timestamp: string;
};

function COOGC() {
  const GROUP_ID = "GC005";
  const [chats, setChats] = useState<Chat[]>([]);
  const [staffId, setStaffId] = useState("");
  const [message, setMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [staffNames, setStaffNames] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  async function fetchStaffName(staffId: string): Promise<string> {
    if (staffNames[staffId]) return staffNames[staffId];
    try {
      const staff: { staff_name: string } = await invoke("get_staff_by_id", {
        id: staffId,
      });
      setStaffNames((prev) => ({ ...prev, [staffId]: staff.staff_name }));
      return staff.staff_name;
    } catch {
      return "Unknown";
    }
  }

  async function fetchLoggedInStaff() {
    try {
      const id: string = await invoke("get_logged_in_staff");
      setStaffId(id);
    } catch {
      toast.error("Unable to verify staff login.");
    }
  }

  async function fetchChats() {
    try {
      const result: Chat[] = await invoke("get_all_chats_by_group", {
        groupId: GROUP_ID,
      });
      setChats(result);
      const uniqueStaffIds = [...new Set(result.map((c) => c.sender_staff_id))];
      for (const id of uniqueStaffIds) {
        if (!staffNames[id]) await fetchStaffName(id);
      }
    } catch (error) {
      toast.error(error as string);
    }
  }

  async function sendMessage() {
    if (!message.trim()) return;
    if (message.length > 100) {
      toast.error("Message cannot exceed 100 characters.");
      return;
    }

    try {
      await invoke("insert_new_chat", {
        senderStaffId: staffId,
        groupId: GROUP_ID,
        message: message.trim(),
      });
      setMessage("");
      await fetchChats();
    } catch (error) {
      toast.error(error as string);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  }

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  function groupChatsByDate(chatList: Chat[]) {
    const grouped: Record<string, Chat[]> = {};
    for (const chat of chatList) {
      const date = new Date(chat.timestamp).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(chat);
    }
    return grouped;
  }

  useEffect(() => {
    fetchLoggedInStaff();
    fetchChats();
    const interval = setInterval(fetchChats, 500);
    return () => clearInterval(interval);
  }, []);

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
  }, [chats.length]);

  const groupedChats = groupChatsByDate(chats);

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <COONavigationBar />
      <Toaster />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(groupedChats).map(([date, messages]) => (
            <div key={date}>
              <div className="text-center text-sm text-gray-500 my-4 font-semibold">
                {formatDate(messages[0].timestamp)}
              </div>
              {messages.map((chat) => (
                <div
                  key={chat.chat_id}
                  className={`max-w-[40%] p-3 rounded-lg mb-2 ${
                    chat.sender_staff_id === staffId
                      ? "ml-auto bg-blue-100 text-right"
                      : "mr-auto bg-white text-left"
                  }`}
                >
                  <div className="font-bold text-sm mb-1 text-gray-600">
                    {staffNames[chat.sender_staff_id] || chat.sender_staff_id}
                  </div>
                  <div className="break-words">{chat.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(chat.timestamp)}
                  </div>
                </div>
              ))}
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
            onKeyDown={handleKeyDown}
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

export default COOGC;
