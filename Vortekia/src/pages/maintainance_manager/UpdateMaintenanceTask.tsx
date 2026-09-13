import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate, useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import CAMMNavigationBar from "../../components/CAMMNavigationBar";

type Staff = {
  staff_id: string;
  staff_name: string;
};

type Ride = {
  ride_id: string;
  ride_name: string;
};

function UpdateMaintenanceTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [allRide, setAllRide] = useState<Ride[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [staffId, setStaffId] = useState("");
  const [rideId, setRideId] = useState("");
  const [maintenanceStart, setMaintenanceStart] = useState("");
  const [status, setStatus] = useState("");

  async function fetchInitialData() {
    try {
      const data = await invoke("get_maintenance_task_by_id", { id: id });
      const task = data as any;

      setName(task.task_name);
      setDesc(task.task_description);
      setRideId(task.ride_id);
      setStaffId(task.staff_id);
      setMaintenanceStart(task.maintenance_start);
      setStatus(task.status);
    } catch (err) {
      toast.error("Failed to load task data.");
    }
  }

  async function fetchAllStaffs() {
    const data: Staff[] = await invoke("get_staff_by_role", { role: "MS" });
    setAllStaff(data);
  }

  async function fetchAllRides() {
    const data: Ride[] = await invoke("get_all_rides");
    setAllRide(data);
  }

  async function handleUpdate(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      await invoke("update_maintenance_task_by_id", {
        id: id,
        name: name,
        description: desc,
        rideId: rideId,
        staffId: staffId,
        time: maintenanceStart,
        status: status,
      });
      toast.success("Task updated successfully");
      navigate(-1);
    } catch (err) {
      toast.error(err as string);
    }
  }

  useEffect(() => {
    fetchInitialData();
    fetchAllStaffs();
    fetchAllRides();
  }, []);

  return (
    <div>
      <CAMMNavigationBar />
      <Toaster />
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Update Maintenance Task
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Task Description
                </label>
                <textarea
                  className="border px-2 w-full rounded-md py-4"
                  placeholder="Enter Task Description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Ride
                </label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={rideId}
                  onChange={(e) => setRideId(e.target.value)}
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
                  className="w-full p-2 border rounded-md"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
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
                  className="w-full p-2 border rounded-md"
                  value={maintenanceStart}
                  onChange={(e) => setMaintenanceStart(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleUpdate}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Update Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateMaintenanceTask;
