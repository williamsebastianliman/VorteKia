import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import RDMNavigationBar from "../../components/RDMNavigationBar";

type Ride = {
  ride_id: string;
  ride_name: string;
  ride_description: string;
  ride_price: string;
  ride_image: string;
  ride_open_time: string;
  ride_close_time: string;
};

function ViewRideDetail() {
  const { id } = useParams();

  const [ride, setRide] = useState<Ride | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  async function fetchRideDetail() {
    try {
      const result: Ride = await invoke("get_ride_by_id", { id });
      setRide(result);
    } catch (error) {
      toast.error("Failed to fetch ride details");
    }
  }

  async function handleUpdate() {
    toast.dismiss();
    try {
      let imageData = null;
      if (newImage) {
        const arrayBuffer = await newImage.arrayBuffer();
        const binaryArray = Array.from(new Uint8Array(arrayBuffer));
        imageData = binaryArray;
      }

      await invoke("update_ride_by_id", {
        id,
        name: ride?.ride_name,
        description: ride?.ride_description,
        price: ride?.ride_price,
        imageData,
        openTime: ride?.ride_open_time,
        closeTime: ride?.ride_close_time,
      });
      toast.success("Ride updated successfully!");
    } catch (err) {
      toast.error("Failed to update ride");
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    fetchRideDetail();
  }, [id]);

  return (
    <div>
      <Toaster />
      <RDMNavigationBar />
      <div className="flex flex-col bg-gray-100 min-h-screen items-center">
        {ride && (
          <>
            <div className="w-full h-64 relative">
              <img
                src={previewImage || `../../${ride.ride_image}`}
                alt="Ride Banner"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 bg-white w-3xl mt-6 shadow-md rounded-md">
              <h2 className="text-center font-bold text-2xl">Ride Details</h2>
              <div className="mt-4 space-y-4">
                <label>
                  <span className="text-gray-700">Ride Name</span>
                  <input
                    type="text"
                    className="border px-4 w-full rounded-md py-2"
                    value={ride.ride_name}
                    onChange={(e) =>
                      setRide({ ...ride, ride_name: e.target.value })
                    }
                  />
                </label>
                <label>
                  <span className="text-gray-700">Description</span>
                  <textarea
                    className="border px-4 w-full rounded-md py-2"
                    value={ride.ride_description}
                    onChange={(e) =>
                      setRide({ ...ride, ride_description: e.target.value })
                    }
                  />
                </label>
                <label>
                  <span className="text-gray-700">Price</span>
                  <input
                    type="text"
                    className="border px-4 w-full rounded-md py-2"
                    value={ride.ride_price}
                    onChange={(e) =>
                      setRide({ ...ride, ride_price: e.target.value })
                    }
                  />
                </label>
                <label>
                  <span className="text-gray-700">Open Time</span>
                  <input
                    type="time"
                    className="border px-4 w-full rounded-md py-2"
                    value={ride.ride_open_time}
                    onChange={(e) =>
                      setRide({ ...ride, ride_open_time: e.target.value })
                    }
                  />
                </label>
                <label>
                  <span className="text-gray-700">Close Time</span>
                  <input
                    type="time"
                    className="border px-4 w-full rounded-md py-2"
                    value={ride.ride_close_time}
                    onChange={(e) =>
                      setRide({ ...ride, ride_close_time: e.target.value })
                    }
                  />
                </label>
                <label>
                  <span className="text-gray-700">Upload New Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </label>
              </div>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 px-4 py-2 rounded-md text-white mt-4"
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ViewRideDetail;
