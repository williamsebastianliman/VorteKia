import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import RDMNavigationBar from "../../components/RDMNavigationBar";

function CreateNewRestaurantProposal() {
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantCuisine, setRestaurantCuisine] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [restaurantOpenTime, setRestaurantOpenTime] = useState("");
  const [restaurantCloseTime, setRestaurantCloseTime] = useState("");
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

    const formattedOpenTime = `${restaurantOpenTime}:00`;
    const formattedCloseTime = `${restaurantCloseTime}:00`;

    let fileData: number[] | null = null;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      fileData = Array.from(new Uint8Array(arrayBuffer));
    }

    try {
      await invoke("insert_new_restaurant_proposal", {
        name: restaurantName,
        cuisine: restaurantCuisine,
        desc: restaurantDescription,
        openTime: formattedOpenTime,
        closeTime: formattedCloseTime,
        fileData: fileData || [],
      });
      toast.success("Proposal sent successfully!");
      setRestaurantName("");
      setRestaurantCuisine("");
      setRestaurantDescription("");
      setRestaurantOpenTime("");
      setRestaurantCloseTime("");
      setFile(null);
      setPreviewFileName(null);
    } catch (error) {
      toast.error(error as string);
    }
  }

  return (
    <div>
      <Toaster />
      <RDMNavigationBar />
      <div className="flex flex-col bg-gray-100 min-h-screen items-center">
        <div className="p-6 bg-white w-3xl mt-6 shadow-md rounded-md">
          <h2 className="text-center font-bold text-2xl">
            Propose New Restaurant
          </h2>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-gray-700">Restaurant Name</span>
              <input
                type="text"
                className="border px-4 w-full rounded-md py-2"
                placeholder="Enter restaurant name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Restaurant Cuisine</span>
              <input
                type="text"
                className="border px-4 w-full rounded-md py-2"
                placeholder="Enter cuisine type"
                value={restaurantCuisine}
                onChange={(e) => setRestaurantCuisine(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Description</span>
              <textarea
                className="border px-4 w-full rounded-md py-2"
                placeholder="Provide a restaurant description (at least 5 characters)"
                value={restaurantDescription}
                onChange={(e) => setRestaurantDescription(e.target.value)}
              ></textarea>
            </label>

            <label className="block">
              <span className="text-gray-700">Opening Time</span>
              <input
                type="time"
                className="border px-4 w-full rounded-md py-2"
                value={restaurantOpenTime}
                onChange={(e) => setRestaurantOpenTime(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Closing Time</span>
              <input
                type="time"
                className="border px-4 w-full rounded-md py-2"
                value={restaurantCloseTime}
                onChange={(e) => setRestaurantCloseTime(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">
                Attach Concept File (PDF only)
              </span>
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
            Send to COO
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateNewRestaurantProposal;
