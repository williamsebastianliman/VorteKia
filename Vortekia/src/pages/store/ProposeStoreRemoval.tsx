import { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import RDMNavigationBar from "../../components/RDMNavigationBar";
import RMNavigationBar from "../../components/RMNavigationBar";

type Store = {
  store_id: string;
  store_name: string;
  store_description: string;
  store_open_time: string;
  store_close_time: string;
  store_location: string;
};

function ProposeStoreRemoval() {
  const [description, setDescription] = useState("");
  const [storeId, setStoreId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [allStores, setAllStores] = useState<Store[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function submitProposal(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      let fileData: number[] = [];
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        fileData = Array.from(new Uint8Array(arrayBuffer));
      }

      await invoke("insert_store_removal_proposal", {
        storeId: storeId,
        removalDescription: description,
        fileData: fileData,
      });

      toast.success("Successfully submitted store removal proposal!");
      setStoreId("");
      setDescription("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function fetchAllStores() {
    try {
      const data: Store[] = await invoke("get_all_stores");
      setAllStores(data);
    } catch {
      toast.error("Failed to fetch store list.");
    }
  }

  useEffect(() => {
    fetchAllStores();
  }, []);

  return (
    <div>
      <RMNavigationBar />
      <Toaster />
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
        <h1 className="text-2xl font-semibold mb-4">Propose Store Removal</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Select Store
            </label>
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full p-2 border rounded bg-white"
            >
              <option value="">None</option>
              {allStores.map((store) => (
                <option key={store.store_id} value={store.store_id}>
                  {store.store_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded h-24"
              placeholder="Provide justification for removal"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Attach Proposal File
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                }
              }}
              ref={fileInputRef}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            onClick={submitProposal}
          >
            Send to COO
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProposeStoreRemoval;
