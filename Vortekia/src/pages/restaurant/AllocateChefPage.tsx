import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";

interface Staff {
  staff_id: string;
  staff_name: string;
}

function AllocateChefPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const staff: Staff[] = await invoke("get_staff_by_role", { role: "CF" });
      console.log("Staff: "+staff)
      setStaffList(staff);
    } catch (error) {
      toast.error("Failed to fetch chef staff");
    }
  };

  const handleAllocate = async () => {
    if (!selectedStaffId) return toast.error("Please select a chef");
    if (!description.trim()) return toast.error("Please provide a description");

    try {
      await invoke("insert_chef_assignment", {
        staffId: selectedStaffId,
        restaurantId: id,
        description: description,
      });
      toast.success("Chef allocated!");
      navigate(-1);
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <div className="bg-white p-6 rounded shadow-md w-96">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 font-medium hover:underline"
        >
          Back
        </button>
        <h2 className="text-xl font-bold text-center mb-4">Allocate Chef</h2>

        <label className="block mb-2 text-gray-700">Select Chef</label>
        <select
          value={selectedStaffId}
          onChange={(e) => setSelectedStaffId(e.target.value)}
          className="w-full border rounded px-4 py-2 mb-4"
        >
          <option value="">-- Select --</option>
          {staffList.map((staff) => (
            <option key={staff.staff_id} value={staff.staff_id}>
              {staff.staff_name}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-4 py-2 mb-4"
          placeholder="Enter description..."
        />

        <button
          onClick={handleAllocate}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded"
        >
          Allocate
        </button>
      </div>
    </div>
  );
}

export default AllocateChefPage;
