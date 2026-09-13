import { useNavigate } from "react-router";
import { useState } from "react";

function CEONavigationBar() {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  function toggleDropdown(menu: string) {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  }

  function goTo(path: string) {
    setOpenDropdown(null);
    navigate(path);
  }

  return (
    <div className="bg-black text-white p-4 flex justify-between items-center relative">
      <div className="font-bold text-xl">CEO</div>
      <div className="flex gap-6 items-center relative">
        <div className="relative">
          <button
            onClick={() => toggleDropdown("retail")}
            className="hover:text-blue-300 font-bold"
          >
            Marketing
          </button>
          {openDropdown === "retail" && (
            <div className="absolute bg-white text-black rounded shadow-md mt-2 z-10 w-64">
              <div
                onClick={() => goTo("/staff/ceo/viewstores")}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                View Stores
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => toggleDropdown("ride")}
            className="hover:text-blue-300 font-bold"
          >
            Operational
          </button>
          {openDropdown === "ride" && (
            <div className="absolute bg-white text-black rounded shadow-md mt-2 z-10 w-64">
              <div
                onClick={() => goTo("/staff/ceo/viewrides")}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                View Rides
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => toggleDropdown("camm")}
            className="hover:text-blue-300 font-bold"
          >
            C&M
          </button>
          {openDropdown === "camm" && (
            <div className="absolute bg-white text-black rounded shadow-md mt-2 z-10 w-64">
              <div
                onClick={() => goTo("/staff/ceo/addmaintenancetask")}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                Assign Maintenance Task
              </div>
              <div
                onClick={() => goTo("/staff/ceo/addreporttask")}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                Assign Report Task
              </div>
              <div
                onClick={() => goTo("/staff/ceo/viewmaintenancetask")}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                View Maintenance Task
              </div>
              <div
                onClick={() => goTo("/staff/ceo/viewreporttask")}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                View Report Task
              </div>
            </div>
          )}
        </div>

        <button
          className="font-bold text-white hover:text-blue-300"
          onClick={() => navigate("/staff/ceo/newrestaurantproposal")}
        >
          New Restaurant Proposal
        </button>
        <button
          className="font-bold text-white hover:text-blue-300"
          onClick={() => navigate("/staff/ceo/newstoreproposal")}
        >
          New Store Proposal
        </button>
        <button
          className="font-bold text-white hover:text-blue-300"
          onClick={() => navigate("/staff/ceo/storeremovalproposal")}
        >
          Store Removal Proposal
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/staff/inbox")}
        >
          Inbox
        </button>
        <button
          className="font-bold text-white hover:text-blue-300"
          onClick={() => navigate("/staff/ceo/groupchat")}
        >
          Group Chat
        </button>
        <button
          className="font-bold text-white hover:text-blue-300"
          onClick={() => navigate("/staff/groupchat")}
        >
          All GC
        </button>
        <button
          className="font-bold text-white hover:text-blue-300"
          onClick={() => navigate("/staff/login")}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default CEONavigationBar;
