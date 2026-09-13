import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router";
import RDMNavigationBar from "../../components/RDMNavigationBar";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type Ride = {
  ride_id: string;
  ride_name: string;
  ride_description: string;
  ride_image: string;
  ride_location: string;
  ride_open_time: string;
  ride_close_time: string;
};

type Staff = {
  staff_id: string;
  staff_name: string;
  staff_email: string;
  staff_password: string;
  staff_role: string;
};

function AssignRideStaffSchedule() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [staffAssigned, setStaffAssigned] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const [staffNames, setStaffNames] = useState<string[]>(Array(6).fill("None"));

  async function getRideName() {
    const data: Ride = await invoke("get_ride_by_id", { id });
    setName(data.ride_name);
  }

  async function getRideStaff() {
    try {
      const data: Staff[] = await invoke("get_staff_by_role", { role: "RS" });
      setStaffs(data);
    } catch (error) {
      toast.error(error as string);
    }
  }

  async function setRideSchedule() {
    try {
      console.log(staffAssigned);
      await invoke("insert_ride_schedule", {
        staffs: staffAssigned,
        rideId: id,
      });
      toast.success("Schedule assigned successfully!");
    } catch (err) {
      toast.error("Staff Already Working On That Shift!");
    }
    getRideName();
    getRideStaff();
    loadSchedule();
    getStaffNames();
  }
  async function getStaffNames() {
    let names: string[] = [];

    for (let i = 0; i < staffAssigned.length; i++) {
      const staffId = staffAssigned[i];

      if (!staffId) {
        names.push("None");
        continue;
      }

      try {
        const staff: Staff = await invoke("get_staff_by_id", {
          id: staffId,
        });
        const staffName: string = staff.staff_name;
        names.push(staffName);
      } catch (error) {
        toast.error(error as string);
        names.push("None");
      }
    }
    console.log(names);
    setStaffNames(names);
  }

  async function loadSchedule() {
    const data: string[] = await invoke("get_assigned_staff_by_ride", { id });
    console.log(data);
    setStaffAssigned(data);
  }

  function updateList(idx: number, selectedStaffId: string | null) {
    setStaffAssigned((prev) => {
      const updatedList = [...prev];
      updatedList[idx] = selectedStaffId;
      return updatedList;
    });
  }

  useEffect(() => {
    getRideName();
    getRideStaff();
    loadSchedule();
  }, []);
  useEffect(() => {
    getStaffNames();
  }, [staffAssigned]);

  return (
    <div className="bg-white">
      <Toaster />
      <RDMNavigationBar />
      <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg mt-20">
        <h2 className="text-xl font-bold mb-4">Assign Ride Staff Schedule</h2>
        <p className="text-gray-600 mb-4">Ride Name: {name}</p>

        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Shift {i + 1}
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={staffAssigned[i] || ""}
              onChange={(e) => updateList(i, e.target.value || null)}
            >
              <option value="">None</option>

              {staffAssigned[i] && (
                <option value={staffAssigned[i]}>
                  {staffNames[i] || staffAssigned[i]}
                </option>
              )}
              {staffs
                .filter((staff) => staff.staff_id !== staffAssigned[i])
                .map((staff) => (
                  <option key={staff.staff_id} value={staff.staff_id}>
                    {staff.staff_name}
                  </option>
                ))}
            </select>
          </div>
        ))}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700 transition"
          onClick={setRideSchedule}
        >
          Assign Schedule
        </button>
      </div>
    </div>
  );
}

export default AssignRideStaffSchedule;
