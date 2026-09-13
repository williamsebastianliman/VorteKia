import { useNavigate } from "react-router";

function WTNavigationBar() {
  const navigate = useNavigate();
  return (
    <div className="bg-black flex justify-between items-center p-4">
      <div className="text-white font-bold">Waiter</div>
      <div className="flex gap-5">
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/wt/viewrestaurant")}
        >
          View Restaurant
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/wt/vieworder")}
        >
          View Order
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/inbox")}
        >
          Inbox
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/wt/groupchat")}
        >
          View Group
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
export default WTNavigationBar;
