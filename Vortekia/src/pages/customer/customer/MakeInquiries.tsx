import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CCNavigationBar from "../../../components/CCNavigationBar";

type ChatMessage = {
  chat_id: string;
  message: string;
  timestamp: string;
  sender_type: "customer" | "oa";
};

function MakeInquiries() {
  const [customerId, setCustomerId] = useState("");
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  async function fetchLoggedInCustomer() {
    try {
      const id: string = await invoke("get_logged_in_customer");
      setCustomerId(id);
    } catch {
      toast.error("Failed to verify customer login.");
    }
  }

  async function fetchChats() {
    try {
      const customerMsgs: any[] = await invoke(
        "get_all_customer_inquiries_by_group",
        { groupId: customerId }
      );

      const oaMsgs: any[] = await invoke(
        "get_all_inquries_response_by_customer",
        { customerId: customerId }
      );

      const combined: ChatMessage[] = [
        ...customerMsgs.map((m) => ({
          chat_id: m.chat_id,
          message: m.message,
          timestamp: m.timestamp,
          sender_type: "customer" as const,
        })),
        ...oaMsgs.map((m) => ({
          chat_id: m.chat_id,
          message: m.message,
          timestamp: m.timestamp,
          sender_type: "oa" as const,
        })),
      ];

      combined.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setChats(combined);
    } catch (err) {
      toast.error("Failed to load chat.");
    }
  }

  async function sendMessage() {
    if (!message.trim()) return;
    if (message.length > 100) {
      toast.error("Message cannot exceed 100 characters.");
      return;
    }

    try {
      await invoke("insert_customer_inquiries", {
        senderCustomerId: customerId,
        groupId: customerId,
        message: message.trim(),
      });
      setMessage("");
      await fetchChats();
    } catch (err) {
      toast.error(err as string);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  function groupChatsByDate(chatList: ChatMessage[]) {
    const grouped: Record<string, ChatMessage[]> = {};
    for (const chat of chatList) {
      const date = new Date(chat.timestamp).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(chat);
    }
    return grouped;
  }

  useEffect(() => {
    fetchLoggedInCustomer();
  }, []);

  useEffect(() => {
    if (customerId) {
      fetchChats();
      const interval = setInterval(fetchChats, 500);
      return () => clearInterval(interval);
    }
  }, [customerId]);

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

  const groupedChats = groupChatsByDate(chats);

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <Toaster />
      <CCNavigationBar />
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
                  className={`max-w-[60%] p-3 rounded-lg mb-2 ${
                    chat.sender_type === "customer"
                      ? "ml-auto bg-blue-100 text-right"
                      : "mr-auto bg-white text-left"
                  }`}
                >
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

export default MakeInquiries;
