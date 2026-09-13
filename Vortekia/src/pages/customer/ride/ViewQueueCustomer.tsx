import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import CRDNavigationBar from "../../../components/CRDNavigationBar";

type RideQueue = {
  ride_id: string;
  queue_number: number;
  customer_id: string;
};

function ViewQueueCustomer() {
  const { id } = useParams();
  const [queues, setQueues] = useState<RideQueue[]>([]);
  const [customer, setCustomer] = useState("");
  const [myQueueNumber, setMyQueueNumber] = useState<number | null>(null);

  async function fetchQueues() {
    try {
      const data: RideQueue[] = await invoke("get_queue_by_ride", {
        id: id,
      });
      setQueues(data);
      console.log("Customer: " + customer);
      if (customer) {
        const myEntry = data.find((q) => q.customer_id === customer);
        console.log("Entry: " + myEntry);
        if (myEntry) {
          const index = data.findIndex((q) => q.customer_id === customer);
          setMyQueueNumber(index + 1);
        }
      } else {
      }
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function fetchLoggedInCustomer() {
    try {
      const result: string = await invoke("get_logged_in_customer");
      setCustomer(result);
    } catch {
      setCustomer("");
    }
  }
  async function handleQueueRide() {
    if (!customer || !id) return;

    try {
      const ride: { ride_price: string } = await invoke("get_ride_by_id", {
        id,
      });
      const customerData: { customer_balance: number } = await invoke(
        "get_customer_by_id",
        {
          id: customer,
        }
      );

      const ridePrice = Math.floor(parseFloat(ride.ride_price));

      if (customerData.customer_balance < ridePrice) {
        toast.error("Insufficient balance to join the queue.");
        return;
      }

      await invoke("deduct_customer_balance", {
        customerId: customer,
        amount: ridePrice,
      });

      await invoke("insert_queue_by_customer", {
        rideId: id,
        customerId: customer,
      });

      toast.success("Successfully queued!");
      fetchQueues();
    } catch (err) {
      toast.error(err as string);
    }
  }

  useEffect(() => {
    fetchLoggedInCustomer();
  }, []);

  useEffect(() => {
    if (id) fetchQueues();
  }, [id, customer]);

  return (
    <div>
      <Toaster />
      <CRDNavigationBar />
      <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Ride Queue Status
          </h1>

          <p className="text-gray-700 text-lg mb-2 text-center">
            Total in Queue:{" "}
            <span className="font-semibold">{queues.length}</span>
          </p>

          {customer && (
            <>
              {myQueueNumber ? (
                <p className="text-blue-600 text-lg text-center font-bold">
                  Your Position: #{myQueueNumber}
                </p>
              ) : (
                <p className="text-red-500 text-center">You're not in queue.</p>
              )}
            </>
          )}

          {!customer && (
            <p className="text-center text-gray-500 mt-2">
              Login to see your queue position.
            </p>
          )}
          {customer && !myQueueNumber && (
            <button
              onClick={handleQueueRide}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Queue This Ride
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewQueueCustomer;
