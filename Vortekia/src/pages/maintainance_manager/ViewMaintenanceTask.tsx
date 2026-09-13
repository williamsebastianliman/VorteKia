import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CNMSNavigationBar from "../../components/CNMSNaivigationBar";
import CAMMNavigationBar from "../../components/CAMMNavigationBar";
import { useNavigate } from "react-router";

type MaintenanceTask = {
  task_id: string;
  task_name: string;
  task_description: string;
  status: string;
  ride_id: string;
  maintenance_start: string;
  staff_id: string;
};

function ViewMaintenanceTask() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const navigate = useNavigate();
  async function fetchAllTasks() {
    try {
      const data: MaintenanceTask[] = await invoke("get_all_maintenance_task");
      setTasks(data);
    } catch (err) {
      toast.error(err as string);
    }
  }
  async function deleteTask(id: string) {
    try {
      await invoke("delete_maintenance_task_by_id", { id: id });
      fetchAllTasks();
    } catch (err) {
      toast.error(err as string);
    }
  }
  useEffect(() => {
    fetchAllTasks();
  }, []);

  return (
    <div>
      <Toaster />
      <CAMMNavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">All Maintenance Tasks</h1>

        <div className="grid grid-cols-4 gap-6">
          {tasks.map((task) => (
            <div
              key={task.task_id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <h2 className="text-xl font-semibold mt-2">{task.task_name}</h2>
              <p className="text-gray-600">
                Task Description: {task.task_description}
              </p>

              <p>Ride ID: {task.ride_id}</p>
              <p>Maintenance Start: {task.maintenance_start}</p>
              <p>Assigned Staff ID: {task.staff_id}</p>
              <p className="text-gray-600 font-bold">Status: {task.status}</p>

              <div className="flex gap-2 mt-4">
                {task.status === "Uncompleted" && (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    onClick={() =>
                      navigate(
                        "/staff/camm/updatemaintenancetask/" + task.task_id
                      )
                    }
                  >
                    Update
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  onClick={() => deleteTask(task.task_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewMaintenanceTask;
