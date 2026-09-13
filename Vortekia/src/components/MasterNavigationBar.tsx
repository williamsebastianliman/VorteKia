import { useNavigate } from "react-router";

function MasterNavigationBar() {
  const navigate = useNavigate();
  return (
    <div className="bg-black flex justify-between items-center p-4">
      <div className="text-white font-bold">Root</div>

      <div className="flex gap-5">
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/login")}
        >
          Staff Login
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/coo/registerstaff")}
        >
          COO Page
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/lnf/addlog")}
        >
          LnF Page
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/cs/registercustomer")}
        >
          Customer Service Page
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/rm/viewstores")}
        >
          Retail Manager Page
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/fnbm/viewrestaurants")}
        >
          FnB Page
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/rdm/viewrides")}
        >
          Ride Manager
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/customer/restaurant/viewdetail/R001")}
        >
          Restaurant
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/camm/addmaintenancetask")}
        >
          C&M Manager
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() =>
            navigate("/staff/cnms/viewmaintenancetask/ST2542500001")
          }
        >
          C&M Staff
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/customer/customer/viewrestaurant")}
        >
          Customer
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/ceo/groupchat")}
        >
          CEO
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/cfo/groupchat")}
        >
          CFO
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/cf/groupchat")}
        >
          Chef
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/sa/groupchat")}
        >
          SA
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/wt/groupchat")}
        >
          Waiter
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/customer/ride/viewdetail/1")}
        >
          Ride
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/customer/store/viewdetail/S001")}
        >
          Store
        </button>
      </div>
    </div>
  );
}
export default MasterNavigationBar;
