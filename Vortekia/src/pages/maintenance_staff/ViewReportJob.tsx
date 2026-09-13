import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import CNMSNavigationBar from "../../components/CNMSNaivigationBar";

type MaintenanceReport = {
  task_id: string;
  reporting_staff: string;
  report_description: string;
  report_image: string;
  report_status: string;
};

function ViewReportJob() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<MaintenanceReport[]>([]);
  const [staffId, setStaffId] = useState<string>("");

  async function getLoggedInStaffId() {
    try {
      const id: string = await invoke("get_logged_in_staff");
      setStaffId(id);
      return id;
    } catch (err) {
      toast.error("Failed to retrieve staff ID");
      return null;
    }
  }

  async function getAllTask(id: string) {
    try {
      const data: MaintenanceReport[] = await invoke(
        "get_all_maintenance_report_by_staff",
        {
          staffId: id,
        }
      );
      setTasks(data);
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function validateOneJob(id: string) {
    toast.dismiss();
    try {
      await invoke("is_staff_inactive", { staffId: id });
      await invoke("is_staff_inactive_report", { staffId: id });
      return true;
    } catch {
      return false;
    }
  }

  async function updateStatus(status: string, report: MaintenanceReport) {
    toast.dismiss();
    try {
      await invoke("update_maintenance_report_status_by_id", {
        id: report.task_id,
        status,
      });
      toast.success(`Successfully Updating Status: '${report.task_id}'`);
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
        <h1 className="text-3xl font-bold mb-6">View Reporting Job</h1>
        <div className="grid grid-cols-4 gap-6">
          {tasks.map((report) => (
            <div
              key={report.task_id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <h2 className="text-xl font-semibold mt-2">{report.task_id}</h2>
              <p className="text-gray-600">{report.report_description}</p>
              <p className="text-gray-600 font-bold">
                Report Status: {report.report_status}
              </p>
              {report.report_image && (
                <img
                  src={`../../${report.report_image}`}
                  alt="Report"
                  className="mt-2 rounded-md object-cover w-full h-32"
                />
              )}
              <div className="flex col-auto gap-5 mt-2">
                {report.report_status === "Uncompleted" && (
                  <button
                    className="bg-blue-600 rounded text-white px-2 py-1"
                    onClick={async () => {
                      const canStart = await validateOneJob(staffId);
                      if (canStart) {
                        updateStatus("On Work", report);
                      } else {
                        toast.error("You can Only Take One Job At a Time");
                      }
                    }}
                  >
                    On Work
                  </button>
                )}
                {report.report_status === "On Work" && (
                  <button
                    className="bg-green-600 rounded text-white px-2 py-1"
                    onClick={() => {
                      navigate(`/staff/cnms/makereport/${report.task_id}`);
                    }}
                  >
                    Write Report
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

export default ViewReportJob;
