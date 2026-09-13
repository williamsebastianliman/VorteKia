import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

function CSTNavigationBar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const statusInterval = useRef<NodeJS.Timeout | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function checkLoginStatus() {
    try {
      const customer = await invoke("get_logged_in_customer");
      if (customer) setIsLoggedIn(true);
    } catch (_) {
      setIsLoggedIn(false);
    }
  }

  async function checkStoreStatus() {
    try {
      const result = await invoke("is_store_open", { id });
      setIsOpen(Boolean(result));
    } catch (_) {
      setIsOpen(false);
    }
  }

  async function logout(auto = false) {
    try {
      await invoke("customer_logout");
      if (!auto) toast.success("Logged out successfully.");
      navigate(`/customer/store/viewdetail/${id}`);
      setTimeout(() => window.location.reload(), 10);
    } catch (error) {
      toast.error(error as string);
    }
  }

  function resetInactivityTimer() {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => logout(true), 60000);
  }

  useEffect(() => {
    checkLoginStatus();
    checkStoreStatus();
    const events = ["mousemove", "keydown"];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer));
    resetInactivityTimer();

    statusInterval.current = setInterval(() => {
      checkStoreStatus();
    }, 1000);

    return () => {
      events.forEach((e) =>
        window.removeEventListener(e, resetInactivityTimer)
      );
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (statusInterval.current) clearInterval(statusInterval.current);
    };
  }, []);

  return (
    <div className="bg-black flex justify-between items-center p-4">
      <Toaster />
      <div className="text-white font-bold">Store</div>
      <div className="flex gap-5">
        {isOpen && isLoggedIn && (
          <button
            className="font-bold text-1xl text-white hover:text-blue-300"
            onClick={() => navigate(`/customer/store/customerstat/${id}`)}
          >
            Customer Stat
          </button>
        )}
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate(`/customer/store/viewdetail/${id}`)}
        >
          View Store Detail
        </button>
        {isOpen && (
          <>
            <button
              className="font-bold text-1xl text-white hover:text-blue-300"
              onClick={() => navigate(`/customer/store/viewsouvenir/${id}`)}
            >
              View Souvenir
            </button>
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
          </>
        )}
      </div>
    </div>
  );
}

export default CSTNavigationBar;
