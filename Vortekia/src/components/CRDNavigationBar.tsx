import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

function CRDNavigationBar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [login, setLogin] = useState(false);
  const [isRideOpen, setIsRideOpen] = useState(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  async function checkLoginStatus() {
    try {
      const result: boolean = await invoke("check_customer_login");
      setLogin(result);
    } catch {
      setLogin(false);
    }
  }

  async function checkRideStatus() {
    if (!id) return;
    try {
      const status: boolean = await invoke("is_ride_open", { id });
      setIsRideOpen(status);
    } catch {
      setIsRideOpen(false);
    }
  }

  async function logout(auto = false) {
    try {
      await invoke("customer_logout");
      if (!auto) toast.success("Logged out successfully.");
      navigate("/customer/ride/viewdetail/" + id);
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
    checkRideStatus();
    const interval = setInterval(checkRideStatus, 1000);
    return () => clearInterval(interval);
  }, [id]);

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
      <div className="text-white font-bold">Ride</div>
      <div className="flex gap-5">
        {login && (
          <button
            className="font-bold text-1xl text-white hover:text-blue-300"
            onClick={() => navigate(`/customer/ride/stat/${id}`)}
          >
            Customer Stat
          </button>
        )}
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate(`/customer/ride/viewdetail/${id}`)}
        >
          View Detail
        </button>
        
        {isRideOpen && (
          <button
            className="font-bold text-1xl text-white hover:text-blue-300"
            onClick={() => navigate(`/customer/ride/viewqueue/${id}`)}
          >
            View Queue
          </button>
        )}
        {isRideOpen && (
          <button
            className="font-bold text-1xl text-white hover:text-blue-300"
            onClick={() => navigate("/customer/login")}
          >
            Login
          </button>
        )}
        {isRideOpen && (
          <button
            className="font-bold text-1xl text-white hover:text-blue-300"
            onClick={() => logout()}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default CRDNavigationBar;
