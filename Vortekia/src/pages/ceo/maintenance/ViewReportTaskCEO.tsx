import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import CEONavigationBar from "../../../components/CEONavigationBar";

type MaintenanceReport = {
  task_id: string;
  reporting_staff: string;
  report_description: string;
  report_image: string;
  report_status: string;
};

function ViewReportTaskCEO() {
  const [reports, setReports] = useState<MaintenanceReport[]>([]);

  async function getAllReports() {
    try {
      const data: MaintenanceReport[] = await invoke(
        "get_all_maintenance_report"
      );
      setReports(data);
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function acceptReport(id: String) {
    await invoke("update_maintenance_report_status_by_id", {
      id: id,
      status: "Finished",
    });
    toast.success("Sucessfully Accepting Report");
    getAllReports();
  }

  async function rejectReport(id: String) {
    await invoke("update_maintenance_report_status_by_id", {
      id: id,
      status: "Uncompleted",
    });
    toast.success("Sucessfully Rejecting Report");
    getAllReports();
  }

  useEffect(() => {
    getAllReports();
  }, []);

  return (
    <div>
      <Toaster />
      <CEONavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">All Maintenance Reports</h1>

        <div className="grid grid-cols-4 gap-6">
          {reports.map((report) => (
            <div
              key={report.task_id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <h2 className="text-xl font-semibold mt-2">{report.task_id}</h2>
              <p className="text-gray-600">
                Reported By: {report.reporting_staff}
              </p>
              <p className="text-gray-600">{report.report_description}</p>
              <p className="text-gray-600 font-bold">
                Status: {report.report_status}
              </p>
              <img
                src={`../${report.report_image}`}
                alt="Report"
                className="mt-2 rounded-md object-cover w-full h-32"
              />
              {report.report_status === "Pending" && (
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    onClick={() => acceptReport(report.task_id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    onClick={() => rejectReport(report.task_id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewReportTaskCEO;
