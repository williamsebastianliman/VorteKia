import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import RDMNavigationBar from "../../components/RDMNavigationBar";

function CreateNewRideProposal() {
  const [rideName, setRideName] = useState("");
  const [ridePrice, setRidePrice] = useState("");
  const [rideDescription, setRideDescription] = useState("");
  const [rideOpenTime, setRideOpenTime] = useState("");
  const [rideCloseTime, setRideCloseTime] = useState("");
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
    console.log("dwiid");

    const formattedOpenTime = `${rideOpenTime}:00`;
    const formattedCloseTime = `${rideCloseTime}:00`;

    let fileData: number[] | null = null;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      fileData = Array.from(new Uint8Array(arrayBuffer));
    }

    try {
      console.log("iw");
      await invoke("insert_new_ride_proposal", {
        name: rideName,
        desc: rideDescription,
        price: ridePrice,
        openTime: formattedOpenTime,
        closeTime: formattedCloseTime,
        fileData: fileData || [],
      });
      console.log("finished?");
      toast.success("Proposal sent successfully!");
      setRideName("");
      setRidePrice("");
      setRideDescription(""),
        setRideCloseTime(""),
        setRideOpenTime(""),
        setFile(null),
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
          <h2 className="text-center font-bold text-2xl">Propose New Ride</h2>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-gray-700">Ride Name</span>
              <input
                type="text"
                className="border px-4 w-full rounded-md py-2"
                placeholder="Enter ride name"
                value={rideName}
                onChange={(e) => setRideName(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Ride Price</span>
              <input
                type="number"
                className="border px-4 w-full rounded-md py-2"
                placeholder="Enter ride price"
                value={ridePrice}
                onChange={(e) => setRidePrice(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Ride Description</span>
              <textarea
                className="border px-4 w-full rounded-md py-2"
                placeholder="Provide a ride description (at least 5 characters)"
                value={rideDescription}
                onChange={(e) => setRideDescription(e.target.value)}
              ></textarea>
            </label>

            <label className="block">
              <span className="text-gray-700">Opening Time</span>
              <input
                type="time"
                className="border px-4 w-full rounded-md py-2"
                value={rideOpenTime}
                onChange={(e) => setRideOpenTime(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Closing Time</span>
              <input
                type="time"
                className="border px-4 w-full rounded-md py-2"
                value={rideCloseTime}
                onChange={(e) => setRideCloseTime(e.target.value)}
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
            Send to COO
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateNewRideProposal;
