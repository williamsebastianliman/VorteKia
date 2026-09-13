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

type MaintenanceTask = {
  task_id: string;
  task_name: string;
};

function AssignReportTask() {
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [allTasks, setAllTasks] = useState<MaintenanceTask[]>([]);
  const [taskId, setTaskId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [description, setDescription] = useState("");

  async function fetchAllStaffs() {
    const data: Staff[] = await invoke("get_staff_by_role", { role: "MS" });
    setAllStaff(data);
  }

  async function fetchAllTasks() {
    const data: MaintenanceTask[] = await invoke("get_all_maintenance_task");
    setAllTasks(data);
  }

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      await invoke("insert_new_maintenance_report", {
        id: taskId,
        staffId: staffId,
        description: description,
      });
      toast.success("Successfully assigned report task");
      setTaskId("");
      setStaffId("");
      setDescription("");
    } catch (err) {
      toast.error(err as string);
    }
  }

  useEffect(() => {
    fetchAllStaffs();
    fetchAllTasks();
  }, []);

  return (
    <div>
      <CAMMNavigationBar />
      <Toaster />
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Assign Report Task
          </h2>
          <form className="space-y-4">
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-black">
                  Task
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setTaskId(e.target.value)}
                  value={taskId}
                >
                  <option value="">None</option>
                  {allTasks.map((task) => (
                    <option key={task.task_id} value={task.task_id}>
                      {task.task_name}
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
                  Report Description
                </label>
                <textarea
                  className="border px-2 w-full rounded-md py-4"
                  placeholder="Enter report description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                ></textarea>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Assign
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssignReportTask;
