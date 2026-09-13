import { useEffect } from "react";
import { useNavigate } from "react-router";
import { invoke } from "@tauri-apps/api/core";
import toast from "react-hot-toast";

function CAMMNavigationBar() {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthorization();
  }, []);

  async function checkAuthorization() {
    try {
      const staffId: string = await invoke("get_logged_in_staff");
      const staff = await invoke("get_staff_by_id", { id: staffId });
      if ((staff as any).staff_role !== "MM") {
        toast.error("Unauthorized access");
        navigate("/staff/login");
      }
    } catch (err) {
      toast.error(err as string);
      navigate("/staff/login");
    }
  }

  return (
    <div className="bg-black flex justify-between items-center p-4">
      <div className="text-white font-bold">C&M Manager</div>
      <div className="flex gap-5">
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/camm/addmaintenancetask")}
        >
          Assign Maintenance Task
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/camm/addreporttask")}
        >
          Assign Report Task
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/camm/viewmaintenancetask")}
        >
          View Maintenance Task
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/camm/viewreporttask")}
        >
          View Report Task
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/inbox")}
        >
          Inbox
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/camm/groupchat")}
        >
          Group Chat
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/camm/oa")}
        >
          Official Account
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/groupchat")}
        >
          All GC
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/login")}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default CAMMNavigationBar;
