import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import CCNavigationBar from "../../../components/CCNavigationBar";

type Ride = {
  ride_id: string;
  ride_name: string;
  ride_description: string;
  ride_image: string;
  ride_location: string;
  ride_price: string;
  ride_open_time: string;
  ride_close_time: string;
  queue_count?: number;
};

function ViewRidesCustomer() {
  const [rides, setRides] = useState<Ride[]>([]);

  async function fetchrides() {
    try {
      const data: Ride[] = await invoke("get_all_rides");

      const ridesWithQueue = await Promise.all(
        data.map(async (ride) => {
          try {
            const queue: any[] = await invoke("get_queue_by_ride", {
              id: ride.ride_id,
            });
            return { ...ride, queue_count: queue.length };
          } catch {
            return { ...ride, queue_count: 0 };
          }
        })
      );

      setRides(ridesWithQueue);
    } catch (error) {
      toast.error(error as string);
    }
  }

  useEffect(() => {
    fetchrides();
  }, []);

  return (
    <div>
      <Toaster />
      <CCNavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-12 underline">Rides</h1>
        <div className="flex flex-col gap-6 items-center justify-center">
          {rides.map((ride) => (
            <div
              key={ride.ride_id}
              className="bg-white shadow-md rounded-lg p-4 w-4xl flex gap-5 flex-col"
            >
              <div className="w-full h-48 bg-gray-200 rounded-lg">
                {ride.ride_image ? (
                  <img
                    src={`../../${ride.ride_image}`}
                    alt={ride.ride_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p>No Image</p>
                )}
              </div>
              <h2 className="text-xl font-semibold mt-2">{ride.ride_name}</h2>
              <p className="text-gray-600">{ride.ride_description}</p>
              <p className="text-gray-600">{"$" + ride.ride_price}</p>
              <p className="text-gray-600">
                {`${ride.ride_open_time}-${ride.ride_close_time}`}
              </p>
              <p className="text-blue-700 font-semibold">
                Current Queue: {ride.queue_count ?? "Loading..."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewRidesCustomer;
