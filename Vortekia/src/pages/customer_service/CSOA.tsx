import { useEffect, useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CSNavigationBar from "../../components/CSNavigationBar";

type Customer = {
  customer_id: string;
};

type ChatMessage = {
  sender: "customer" | "staff";
  message: string;
  timestamp: string;
};

function CSOA() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  async function fetchCustomers() {
    try {
      const data: Customer[] = await invoke("get_all_customers_inquired");
      setCustomers(data);
    } catch {
      toast.error("Failed to load customer list");
    }
  }

  async function fetchChat(customerId: string) {
    try {
      const customerMsgs: any[] = await invoke(
        "get_all_customer_inquiries_by_group",
        { groupId: customerId }
      );
      const staffMsgs: any[] = await invoke(
        "get_all_inquries_response_by_customer",
        { customerId }
      );

      const combined: ChatMessage[] = [
        ...customerMsgs.map((m) => ({
          sender: "customer" as const,
          message: m.message,
          timestamp: m.timestamp,
        })),
        ...staffMsgs.map((m) => ({
          sender: "staff" as const,
          message: m.message,
          timestamp: m.timestamp,
        })),
      ];

      combined.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setMessages(combined);
    } catch {
      toast.error("Failed to load chat");
    }
  }

  async function sendMessage() {
    if (!inputMessage.trim() || !selectedCustomer) return;

    if (inputMessage.length > 100) {
      toast.error("Message cannot exceed 100 characters.");
      return;
    }

    try {
      await invoke("insert_inquries_response", {
        customerId: selectedCustomer,
        message: inputMessage.trim(),
      });
      setInputMessage("");
      await fetchChat(selectedCustomer);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      toast.error("Failed to send message");
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchChat(selectedCustomer);
      intervalRef.current = setInterval(() => {
        fetchChat(selectedCustomer);
      }, 500);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [selectedCustomer]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div>
      <CSNavigationBar />
      <Toaster />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="font-bold text-xl mb-4">Customers</h2>
          {customers.map((cust) => (
            <div
              key={cust.customer_id}
              onClick={() => setSelectedCustomer(cust.customer_id)}
              className={`p-3 mb-2 rounded cursor-pointer ${
                selectedCustomer === cust.customer_id
                  ? "bg-blue-200"
                  : "bg-white"
              }`}
            >
              {cust.customer_id}
            </div>
          ))}
        </div>

        <div className="w-2/3 flex flex-col relative">
          <div className="flex-1 p-4 overflow-y-auto">
            <h2 className="font-bold text-xl mb-4">
              Chat with: {selectedCustomer || "None Selected"}
            </h2>
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-lg p-3 rounded-lg shadow ${
                    msg.sender === "staff"
                      ? "ml-auto bg-blue-100 text-right"
                      : "mr-auto bg-gray-200 text-left"
                  }`}
                >
                  <div className="text-sm text-gray-700">{msg.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="p-4 border-t bg-white flex gap-2 sticky bottom-0 z-10">
            <input
              type="text"
              value={inputMessage}
              maxLength={100}
              onChange={(e) => setInputMessage(e.target.value)}
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
    </div>
  );
}

export default CSOA;
