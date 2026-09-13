import { useNavigate } from "react-router";

function CNMSNavigationBar() {
  const navigate = useNavigate();
  return (
    <div className="bg-black flex justify-between items-center p-4">
      <div className="text-white font-bold">C&M Manager</div>
      <div className="flex gap-5">
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/cnms/viewmaintenancetask")}
        >
          View Maintenance Task
        </button>
        <button
          className="font-bold text-1xl text-white  hover:text-blue-300"
          onClick={() => navigate("/staff/cnms/viewreporttask")}
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
          className="font-bold text-1xl text-white  hover:text-blue-300"
          onClick={() => navigate("/staff/cnms/groupchat")}
        >
          Group Chat
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/groupchat")}
        >
          All GC
        </button>
        <button
          className="font-bold text-1xl text-white  hover:text-blue-300"
          onClick={() => navigate("/staff/login")}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
export default CNMSNavigationBar;
