import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router";
import CEONavigationBar from "../../../components/CEONavigationBar";

type Ride = {
  ride_id: string;
  ride_name: string;
  ride_description: string;
  ride_image: string;
  ride_location: string;
  ride_open_time: string;
  ride_close_time: string;
};
function ViewRideCEO() {
  const [rides, setrides] = useState<Ride[]>([]);
  const navigate = useNavigate();
  async function fetchrides() {
    try {
      const data: Ride[] = await invoke("get_all_rides");
      console.log(data);
      setrides(data);
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
      <CEONavigationBar />
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
              <p className="text-gray-600">
                {`${ride.ride_open_time}-${ride.ride_close_time}`}
              </p>
              <div className="flex col-auto gap-5 mt-2">
                <button
                  className=" bg-blue-500 rounded text-white px-2 py-1 "
                  onClick={() => navigate(`/staff/ceo/ride/${ride.ride_id}`)}
                >
                  View Detail
                </button>
                <button
                  className=" bg-blue-500 rounded text-white px-2 py-1 "
                  onClick={() =>
                    navigate(`/staff/ceo/assignstaff/${ride.ride_id}`)
                  }
                >
                  Assign Staff
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ViewRideCEO;
