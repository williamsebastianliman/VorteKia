import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import LNFNavigationBar from "../../components/LNFNavigationBar";

type ItemLog = {
  itemlog_id: string;
  itemlog_name: string;
  itemlog_type: string;
  itemlog_color: string;
  itemlog_location: string;
  itemlog_image: string;
  customer_id: string;
  itemlog_status: string;
};

function ViewItemLog() {
  const [itemLogs, setItemLogs] = useState<ItemLog[]>([]);
  const navigate = useNavigate();

  async function fetchItemLogs() {
    try {
      const data: ItemLog[] = await invoke("get_all_itemlogs");
      setItemLogs(data);
    } catch (error) {
      toast.error(error as string);
    }
  }

  const handleDelete = async (
    id: String,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      event.preventDefault();
      await invoke<string>("delete_itemlog_by_id", { id });
      fetchItemLogs();
    } catch (error) {
      toast.error(error as string);
    }
  };

  useEffect(() => {
    fetchItemLogs();
  }, []);

  return (
    <div>
      <Toaster />
      <LNFNavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Item Logs</h1>

        <div className="grid grid-cols-4 gap-6">
          {itemLogs.map((item) => (
            <div
              key={item.itemlog_id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                {item.itemlog_image ? (
                  <img
                    src={`../${item.itemlog_image}`}
                    alt={item.itemlog_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-gray-500 text-center">No Image</p>
                )}
              </div>

              <h2 className="text-xl font-semibold mt-2">
                {item.itemlog_name}
              </h2>
              <p className="text-gray-600">Type: {item.itemlog_type}</p>
              <p className="text-gray-600">Color: {item.itemlog_color}</p>
              <p className="text-gray-600">Location: {item.itemlog_location}</p>
              <p className="text-gray-600">Customer: {item.customer_id}</p>
              <p className="text-gray-800 font-semibold">
                Status: {item.itemlog_status}
              </p>
              <div className="flex col-auto gap-5 mt-2">
                <button
                  className="bg-red-600 rounded text-white px-2 py-1"
                  onClick={(e) => handleDelete(item.itemlog_id, e)}
                >
                  Delete
                </button>
                <button
                  className="bg-blue-600 rounded text-white px-2 py-1"
                  onClick={() =>
                    navigate(`/staff/lnf/updatelog/${item.itemlog_id}`)
                  }
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewItemLog;
