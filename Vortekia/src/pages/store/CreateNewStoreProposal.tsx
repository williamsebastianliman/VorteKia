import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import RMNavigationBar from "../../components/RMNavigationBar";

function CreateNewStoreProposal() {
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeOpenTime, setStoreOpenTime] = useState("");
  const [storeCloseTime, setStoreCloseTime] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewFileName(selectedFile.name);
    }
  };

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    const formattedOpenTime = `${storeOpenTime}:00`;
    const formattedCloseTime = `${storeCloseTime}:00`;

    let fileData: number[] | null = null;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      fileData = Array.from(new Uint8Array(arrayBuffer));
    }

    try {
      await invoke("insert_new_store_proposal", {
        name: storeName,
        desc: storeDescription,
        openTime: formattedOpenTime,
        closeTime: formattedCloseTime,
        location: storeLocation,
        fileData: fileData || [],
      });

      toast.success("Store proposal submitted!");

      setStoreName("");
      setStoreDescription("");
      setStoreLocation("");
      setStoreOpenTime("");
      setStoreCloseTime("");
      setFile(null);
      setPreviewFileName(null);
    } catch (error) {
      toast.error(error as string);
    }
  }

  return (
    <div>
      <Toaster />
      <RMNavigationBar />
      <div className="flex flex-col bg-gray-100 min-h-screen items-center">
        <div className="p-6 bg-white w-3xl mt-6 shadow-md rounded-md">
          <h2 className="text-center font-bold text-2xl">Propose New Store</h2>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-gray-700">Store Name</span>
              <input
                type="text"
                className="border px-4 w-full rounded-md py-2"
                placeholder="Enter store name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Store Description</span>
              <textarea
                className="border px-4 w-full rounded-md py-2"
                placeholder="Provide a store description"
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
              ></textarea>
            </label>

            <label className="block">
              <span className="text-gray-700">Store Location</span>
              <input
                type="text"
                className="border px-4 w-full rounded-md py-2"
                placeholder="Enter location"
                value={storeLocation}
                onChange={(e) => setStoreLocation(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Opening Time</span>
              <input
                type="time"
                className="border px-4 w-full rounded-md py-2"
                value={storeOpenTime}
                onChange={(e) => setStoreOpenTime(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Closing Time</span>
              <input
                type="time"
                className="border px-4 w-full rounded-md py-2"
                value={storeCloseTime}
                onChange={(e) => setStoreCloseTime(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Attach Concept File</span>
              <input
                type="file"
                accept=".pdf"
                className="w-full px-4 py-2 border rounded-md"
                onChange={handleFileChange}
              />
              {previewFileName && (
                <p className="text-gray-500 text-sm mt-1">
                  Selected: {previewFileName}
                </p>
              )}
            </label>
          </div>

          <button
            className="bg-blue-500 px-4 py-2 rounded-md text-white mt-4 w-full"
            onClick={handleSubmit}
          >
            Submit Proposal
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateNewStoreProposal;
