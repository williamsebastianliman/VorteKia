import { useNavigate } from "react-router";

function COONavigationBar() {
  const navigate = useNavigate();
  return (
    <div className="bg-black flex justify-between items-center p-4">
      <div className="text-white font-bold">COO</div>
      <div className="flex gap-5">
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/coo/registerstaff")}
        >
          Register Staff
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/coo/viewrides")}
        >
          View Rides
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/coo/maintenance")}
        >
          View Maintenance Task
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/coo/rideremovalproposal")}
        >
          Ride Removal Proposal
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/coo/newrideproposal")}
        >
          New Ride Proposal
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/inbox")}
        >
          Inbox
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/coo/groupchat")}
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
export default COONavigationBar;
