import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import RSNavigationBar from "../../components/RSNavigationBar";

type RideQueue = {
  ride_id: string;
  queue_number: number;
  customer_id: string;
};

type Ride = {
  ride_id: string;
  ride_name: string;
  ride_description: string;
  ride_open_time: string;
  ride_close_time: string;
  ride_image: string;
};

function ViewQueue() {
  const [queues, setQueues] = useState<RideQueue[]>([]);
  const [rideId, setRideId] = useState("");
  const [rideData, setRideData] = useState<Ride | null>(null);
  const [staffId, setStaffId] = useState("");
  const [empty, setEmpty] = useState("");
  const navigate = useNavigate();

  async function fetchLoggedInStaff() {
    try {
      const id: string = await invoke("get_logged_in_staff");
      setStaffId(id);
    } catch {
      toast.error("Unable to verify staff login.");
    }
  }

  async function fetchRideAndQueue(staffId: string) {
    try {
      const ride_id: string = await invoke("get_ride_by_schedule", {
        id: staffId,
      });
      setRideId(ride_id);

      const ride: Ride = await invoke("get_ride_by_id", { id: ride_id });
      setRideData(ride);

      const data: RideQueue[] = await invoke("get_queue_by_staff", {
        id: staffId,
      });
      setQueues(data);
    } catch (err) {
      setEmpty("No Work In This Shift");
    }
  }

  async function deleteQueue(queue_number: number) {
    try {
      await invoke("delete_queue_by_key", {
        rideId,
        queueNumber: queue_number,
      });
      fetchRideAndQueue(staffId);
    } catch (err) {
      toast.error(err as string);
    }
  }

  useEffect(() => {
    fetchLoggedInStaff();
  }, []);

  useEffect(() => {
    if (staffId) {
      fetchRideAndQueue(staffId);
    }
  }, [staffId]);

  return (
    <div>
      <Toaster />
      <RSNavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        {rideData && (
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
              {rideData.ride_image ? (
                <img
                  src={`../../${rideData.ride_image}`}
                  alt={rideData.ride_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-center text-gray-500">No Image</p>
              )}
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-bold">{rideData.ride_name}</h1>
              <p className="text-gray-700">{rideData.ride_description}</p>
              <p className="text-gray-500 mt-1">
                Open: {rideData.ride_open_time} | Close:{" "}
                {rideData.ride_close_time}
              </p>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6 underline">Queue</h1>
        {empty && (
          <h1 className="text-2xl font-bold text-red-600 mb-4">{empty}</h1>
        )}

        {rideId && (
          <div className="mb-6">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => navigate(`/staff/rs/insertqueue/${rideId}`)}
            >
              Insert Queue
            </button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-6">
          {queues.map((queue, index) => (
            <div
              key={queue.queue_number}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
            >
              <h2 className="text-xl font-semibold">#{index + 1}</h2>
              <p className="text-gray-600">Customer: {queue.customer_id}</p>
              <div className="flex flex-row gap-3 mt-4">
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => deleteQueue(queue.queue_number)}
                >
                  Delete
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() =>
                    navigate(
                      `/staff/rs/updatequeue/${rideId}/${queue.queue_number}`
                    )
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

export default ViewQueue;
