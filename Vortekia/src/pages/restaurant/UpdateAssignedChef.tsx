import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";

function UpdateAssignedChef() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchAssignment();
  }, []);

  const fetchAssignment = async () => {
    try {
      const assignment = await invoke("get_chef_assignment_by_staff", {
        staffId: id,
      });
      if (assignment) {
        const data = assignment as any;
        setStaffId(data.staff_id);
        setRestaurantId(data.restaurant_id);
        setDescription(data.description);
      }
    } catch (error) {
      toast.error("Failed to fetch chef assignment.");
    }
  };

  const handleUpdate = async () => {
    try {
      await invoke("update_chef_assignment", {
        staffId: staffId,
        newRestaurantId: restaurantId,
        description: description,
      });
      toast.success("Chef assignment updated!");
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
        <h2 className="text-xl font-bold text-center mb-4">
          Update Assigned Chef
        </h2>
        <label className="block mb-2 text-gray-700">Staff ID</label>
        <select
          value={staffId}
          disabled
          className="w-full border px-4 py-2 mb-4 rounded"
        >
          <option value={staffId}>{staffId}</option>
        </select>
        <label className="block mb-2 text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 mb-4 rounded"
        />
        <button
          onClick={handleUpdate}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default UpdateAssignedChef;
