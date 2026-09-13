import { useNavigate } from "react-router";

function LNFNavigationBar() {
  const navigate = useNavigate();
  return (
    <div className="bg-black flex justify-between items-center p-4">
      <div className="text-white font-bold">Lost and Found</div>
      <div className="flex gap-5">
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/lnf/addlog")}
        >
          Add Item Log
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/lnf/viewlog")}
        >
          View Item Log
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/inbox")}
        >
          Inbox
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/lnf/groupchat")}
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
export default LNFNavigationBar;
