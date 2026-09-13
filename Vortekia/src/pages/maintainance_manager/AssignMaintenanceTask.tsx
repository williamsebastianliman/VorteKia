import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import CAMMNavigationBar from "../../components/CAMMNavigationBar";

type Staff = {
  staff_id: string;
  staff_name: string;
  staff_email: string;
  staff_password: string;
  staff_role: string;
};

type Ride = {
  ride_id: string;
  ride_name: string;
  ride_description: string;
  ride_image: string;
  ride_location: string;
  ride_open_time: string;
  ride_close_time: string;
};

function AssignMaintenanceTask() {
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [allRide, setAllRide] = useState<Ride[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [staffId, setStaffId] = useState("");
  const [rideId, setRideId] = useState("");
  const [maintenanceStart, setMaintenanceStart] = useState("");
  async function fetchAllStaffs() {
    const data: Staff[] = await invoke("get_staff_by_role", { role: "MS" });
    setAllStaff(data);
    console.log(allStaff);
  }
  async function fetchAllRides() {
    const data: Ride[] = await invoke("get_all_rides");
    setAllRide(data);
    console.log(allRide);
  }
  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    console.log(staffId);
    console.log(rideId);
    try {
      console.log(maintenanceStart);

      await invoke("insert_new_maintenance_task", {
        name: name,
        description: desc,
        rideId: rideId,
        staffId: staffId,
        time: maintenanceStart,
      });
      toast.success("Successfully Assigning New Task");
      setName("");
      setDesc("");
      setStaffId("");
      setRideId("");
      setMaintenanceStart("");
    } catch (err) {
      toast.error(err as string);
    }
  }
  useEffect(() => {
    fetchAllStaffs();
    fetchAllRides();
  }, []);
  return (
    <div>
      <CAMMNavigationBar />
      <Toaster />
      <div className="flex justify-center items-center min-h-screen  bg-blue-50">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Create New Maintenance Task
          </h2>
          <form className="space-y-4">
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-black">
                  Task Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Enter Task Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Task Description
                </label>
                <textarea
                  className="border px-2 w-full rounded-md py-4"
                  placeholder="Enter Task Description"
                  onChange={(e) => setDesc(e.target.value)}
                  value={desc}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Ride
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setRideId(e.target.value)}
                  value={rideId}
                >
                  <option value="">None</option>
                  {allRide.map((ride) => (
                    <option key={ride.ride_id} value={ride.ride_id}>
                      {ride.ride_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Assigned Staff
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setStaffId(e.target.value)}
                  value={staffId}
                >
                  <option value="">None</option>
                  {allStaff.map((staff) => (
                    <option key={staff.staff_id} value={staff.staff_id}>
                      {staff.staff_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Maintenance Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setMaintenanceStart(e.target.value)}
                  value={maintenanceStart}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Insert
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssignMaintenanceTask;
