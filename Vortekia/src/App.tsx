import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"loading" | "master" | "redirecting">(
    "loading"
  );
  const [inputAppId, setInputAppId] = useState("");

  useEffect(() => {
    async function redirect() {
      try {
        const appId: string = await invoke("get_app_id_command");

        if (appId === "master") {
          setMode("master");
        } else {
          setMode("redirecting");
          if (appId === "staff") {
            navigate("/staff/login");
          } else if (appId === "customer") {
            navigate("/customer/customer/viewrestaurant");
          } else if (appId.startsWith("RS")) {
            navigate(`/customer/restaurant/viewdetail/${appId}`);
          } else if (appId.startsWith("RD")) {
            navigate(`/customer/ride/viewdetail/${appId}`);
          } else if (appId.startsWith("ST")) {
            navigate(`/customer/store/viewdetail/${appId}`);
          } else {
            navigate("/error/unknownerror");
          }
        }
      } catch {
        navigate("/error/unknownerror");
      }
    }

    redirect();
  }, []);

  const handleManualRedirect = () => {
    const appId = inputAppId.trim();
    if (!appId) return;

    if (appId === "staff") {
      navigate("/staff/login");
    } else if (appId === "customer") {
      navigate("/customer/customer/viewrestaurant");
    } else if (appId.startsWith("RS")) {
      navigate(`/customer/restaurant/viewdetail/${appId}`);
    } else if (appId.startsWith("RD")) {
      navigate(`/customer/ride/viewdetail/${appId}`);
    } else if (appId.startsWith("ST")) {
      navigate(`/customer/store/viewdetail/${appId}`);
    } else {
      navigate("/error/unknownerror");
    }
  };

  if (mode === "master") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4">App Entry</h1>
          <input
            type="text"
            value={inputAppId}
            onChange={(e) => setInputAppId(e.target.value)}
            placeholder="Enter App ID"
            className="w-full px-4 py-2 border rounded mb-4"
          />
          <button
            onClick={handleManualRedirect}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
