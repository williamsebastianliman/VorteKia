import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CRDNavigationBar from "../../../components/CRDNavigationBar";

type Ride = {
  ride_id: string;
  ride_name: string;
  ride_description: string;
  ride_price: number;
  ride_image: string;
  ride_open_time: string;
  ride_close_time: string;
};

function ViewRideDetailCustomer() {
  const { id } = useParams();
  const [ride, setRide] = useState<Ride | null>(null);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  async function fetchRideDetail() {
    try {
      const result: Ride = await invoke("get_ride_by_id", { id });
      setRide(result);
    } catch (error) {
      toast.error("Failed to load ride details.");
    }
  }

  async function fetchRideStatus() {
    try {
      const status: boolean = await invoke("is_ride_open", { id: id });
      setIsOpen(status);
    } catch (err) {
      toast.error(err as string);
    }
  }

  useEffect(() => {
    fetchRideDetail();
    fetchRideStatus();
    const interval = setInterval(fetchRideStatus, 1000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div>
      <Toaster />
      <CRDNavigationBar />
      <div className="flex flex-col bg-gray-100 min-h-screen items-center">
        {ride && (
          <>
            <div className="w-full h-64 relative">
              <img
                src={`../../${ride.ride_image}`}
                alt="Ride Banner"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 bg-white w-3xl mt-6 shadow-md rounded-md">
              <h2 className="text-center font-bold text-2xl mb-4">
                Ride Details
              </h2>

              <div className="space-y-4">
                <div>
                  <span className="block font-semibold text-gray-700">
                    Name:
                  </span>
                  <p className="text-gray-900">{ride.ride_name}</p>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">
                    Description:
                  </span>
                  <p className="text-gray-900">{ride.ride_description}</p>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">
                    Price:
                  </span>
                  <p className="text-gray-900">${ride.ride_price}</p>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">
                    Open Time:
                  </span>
                  <p className="text-gray-900">{ride.ride_open_time}</p>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">
                    Close Time:
                  </span>
                  <p className="text-gray-900">{ride.ride_close_time}</p>
                </div>

                <div>
                  <span className="block font-semibold text-gray-700">
                    Status:
                  </span>
                  <p
                    className={`font-bold ${
                      isOpen ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOpen === null
                      ? "Checking..."
                      : isOpen
                      ? "OPEN"
                      : "CLOSED"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ViewRideDetailCustomer;
