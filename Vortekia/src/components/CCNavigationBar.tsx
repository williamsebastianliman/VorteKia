import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

function CCNavigationBar() {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  async function checkLoginStatus() {
    try {
      const result: boolean = await invoke("check_customer_login");
      setLogin(result);
    } catch {
      setLogin(false);
    }
  }

  async function logout(auto = false) {
    try {
      await invoke("customer_logout");
      if (auto) {
      } else toast.success("Logged out successfully.");

      navigate("/customer/customer/viewrestaurant");
      setTimeout(() => {
        window.location.reload();
      }, 10);
    } catch (error) {
      toast.error(error as string);
    }
  }

  function resetInactivityTimer() {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      if (login) logout(true);
    }, 60000);
  }

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const events = ["mousemove", "keydown"];
    events.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );
    resetInactivityTimer();
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [login]);

  return (
    <div className="bg-black flex justify-between items-center p-4">
      <Toaster />
      <div className="text-white font-bold">Customer</div>
      <div className="flex gap-5">
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/customer/customer/viewrestaurant")}
        >
          View Restaurants
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/customer/customer/viewride")}
        >
          View Rides
        </button>
        {login && (
          <button
            className="font-bold text-1xl text-white hover:text-blue-300"
            onClick={() => navigate("/customer/customer/inbox")}
          >
            Inbox
          </button>
        )}
        {login && (
          <button
            className="font-bold text-1xl text-white hover:text-blue-300"
            onClick={() => navigate("/customer/customer/topup")}
          >
            Topup
          </button>
        )}
        {login && (
          <button
            className="font-bold text-1xl text-white hover:text-blue-300"
            onClick={() => navigate("/customer/customer/makeinquiries")}
          >
            Make Inquiries
          </button>
        )}
        {login && (
          <button
            className="font-bold text-1xl text-white hover:text-blue-300"
            onClick={() => navigate("/customer/customer/notif")}
          >
            Notification
          </button>
        )}

        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/customer/login")}
        >
          Login
        </button>
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default CCNavigationBar;
