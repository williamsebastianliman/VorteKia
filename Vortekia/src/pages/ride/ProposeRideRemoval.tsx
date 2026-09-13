import { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import RDMNavigationBar from "../../components/RDMNavigationBar";

type Ride = {
  ride_id: string;
  ride_name: string;
  ride_description: string;
  ride_image: string;
  ride_location: string;
  ride_open_time: string;
  ride_close_time: string;
};

function ProposeRideRemoval() {
  const [description, setDescription] = useState("");
  const [rideId, setRideId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [allRides, setAllRides] = useState<Ride[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  async function submitProposal(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      let fileData: number[] = [];
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        fileData = Array.from(new Uint8Array(arrayBuffer));
      }
      console.log(rideId + "ride ID");
      await invoke("insert_ride_removal_proposal", {
        rideId: rideId,
        removalDescription: description,
        fileData: fileData,
      });
      toast.success("Successfully Inserting New Proposal!");
      setRideId("");
      setDescription("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      toast.error(err as string);
    }
  }
  async function fetchAllRides() {
    const data: Ride[] = await invoke("get_all_rides");
    setAllRides(data);
    console.log(data);
  }
  useEffect(() => {
    fetchAllRides();
  }, []);

  return (
    <div>
      <RDMNavigationBar />
      <Toaster />
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
        <h1 className="text-2xl font-semibold mb-4">Propose Ride Removal</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Select Ride
            </label>
            <select
              value={rideId}
              onChange={(e) => setRideId(e.target.value)}
              className="w-full p-2 border rounded bg-white"
            >
              <option value="">None</option>
              {allRides.map((ride) => (
                <option key={ride.ride_id} value={ride.ride_id}>
                  {ride.ride_name}
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={submitProposal}
          >
            Send to COO
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProposeRideRemoval;
