import { useEffect, useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CSNavigationBar from "../../components/CSNavigationBar";
import CAMMNavigationBar from "../../components/CAMMNavigationBar";

type ChatMessage = {
  sender_staff_id: string;
  message: string;
  timestamp: string;
  is_reply: number;
};

function MMOA() {
  const [uniqueStaffRequesters, setUniqueStaffRequesters] = useState<string[]>(
    []
  );
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const GROUP_ID = "GC002";

  async function fetchAndUpdateMessages(staffId: string) {
    try {
      const data: ChatMessage[] = await invoke(
        "get_all_chat_oa_by_real_group",
        {
          groupId: GROUP_ID,
        }
      );

      const uniqueStaff = Array.from(
        new Set(
          data.filter((m) => m.is_reply === 0).map((m) => m.sender_staff_id)
        )
      );
      setUniqueStaffRequesters(uniqueStaff);

      const staffMessages =
        staffId === ""
          ? []
          : data.filter(
              (m) =>
                m.sender_staff_id === staffId ||
                (m.is_reply === 1 && m.sender_staff_id === staffId)
            );

      staffMessages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setMessages(staffMessages);
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function sendMessage() {
    if (!inputMessage.trim() || !selectedStaff) return;

    try {
      await invoke("insert_new_chat_oa", {
        senderStaffId: selectedStaff,
        groupId: GROUP_ID,
        message: inputMessage.trim(),
        isReply: 1,
      });
      setInputMessage("");
      await fetchAndUpdateMessages(selectedStaff);
    } catch (err) {
      toast.error(err as string);
    }
  }

  useEffect(() => {
    fetchAndUpdateMessages("");
  }, []);

  useEffect(() => {
    if (selectedStaff) {
      fetchAndUpdateMessages(selectedStaff);

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        fetchAndUpdateMessages(selectedStaff);
      }, 500);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedStaff]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div>
      <CAMMNavigationBar />
      <Toaster />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="font-bold text-xl mb-4">Staff Requests</h2>
          {uniqueStaffRequesters.map((staffId) => (
            <div
              key={staffId}
              onClick={() => setSelectedStaff(staffId)}
              className={`p-3 mb-2 rounded cursor-pointer ${
                selectedStaff === staffId ? "bg-blue-200" : "bg-white"
              }`}
            >
              {staffId}
            </div>
          ))}
        </div>

        <div className="w-2/3 flex flex-col relative">
          <div className="flex-1 p-4 overflow-y-auto">
            <h2 className="font-bold text-xl mb-4">
              Chat with: {selectedStaff || "None Selected"}
            </h2>
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-lg p-3 rounded-lg shadow ${
                    msg.is_reply
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
              placeholder="Type a response..."
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

export default MMOA;
