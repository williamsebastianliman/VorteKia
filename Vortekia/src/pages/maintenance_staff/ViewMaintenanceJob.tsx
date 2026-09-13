import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CNMSNavigationBar from "../../components/CNMSNaivigationBar";

type MaintenanceTask = {
  task_id: string;
  task_name: string;
  task_description: string;
  status: string;
  ride_id: string;
  maintenance_start: string;
  staff_id: string;
};

function ViewMaintenanceJob() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [staffId, setStaffId] = useState<string>("");

  async function getLoggedInStaffId() {
    try {
      const id: string = await invoke("get_logged_in_staff");
      setStaffId(id);
      return id;
    } catch (err) {
      toast.error("Failed to retrieve logged in staff");
      return null;
    }
  }

  async function getAllTask(id: string) {
    try {
      const data: MaintenanceTask[] = await invoke(
        "get_all_maintenance_task_by_staff",
        {
          staffId: id,
        }
      );
      setTasks(data);
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function validateOneJob(staffId: string) {
    toast.dismiss();
    try {
      await invoke("is_staff_inactive", { staffId });
      await invoke("is_staff_inactive_report", { staffId });
      return true;
    } catch (err) {
      return false;
    }
  }

  async function updateStatus(status: string, task: MaintenanceTask) {
    toast.dismiss();
    try {
      await invoke("update_maintenance_task_status_by_id", {
        id: task.task_id,
        status,
      });
      toast.success("Successfully Updating Task!");
      getAllTask(staffId);
    } catch (err) {
      toast.error(err as string);
    }
  }

  useEffect(() => {
    getLoggedInStaffId().then((id) => {
      if (id) getAllTask(id);
    });
  }, []);

  return (
    <div>
      <Toaster />
      <CNMSNavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">View Maintenance Job</h1>

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
              <p>Status: {task.status}</p>
              <div className="flex col-auto gap-5 mt-2">
                {task.status === "Uncompleted" && (
                  <button
                    className="bg-blue-600 rounded text-white px-2 py-1"
                    onClick={async () => {
                      const canStart = await validateOneJob(staffId);
                      if (canStart) {
                        updateStatus("On Work", task);
                      } else {
                        toast.error("You can Only Take One Job At a Time");
                      }
                    }}
                  >
                    On Work
                  </button>
                )}
                {task.status === "On Work" && (
                  <button
                    className="bg-green-600 rounded text-white px-2 py-1"
                    onClick={() => {
                      updateStatus("Finished", task);
                      toast.success(`Completing task "${task.task_name}"`);
                    }}
                  >
                    Complete Job
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewMaintenanceJob;
