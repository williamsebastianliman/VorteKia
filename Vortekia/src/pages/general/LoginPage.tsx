import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router";
import { invoke } from "@tauri-apps/api/core";
import ReturnNavigationBar from "../../components/ReturnNavigationBar";

function LoginPage() {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      await invoke("customer_login", { id });
      navigate(-1);
    } catch (error) {
      toast.error(error as string);
    }
  }

  function handleBack() {
    navigate(-1);
  }

  return (
    <div>
      <Toaster />
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Customer Login
          </h2>

          <button
            onClick={handleBack}
            className="mb-4 text-blue-500 hover:underline text-sm"
          >
            Back
          </button>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Customer ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter your Customer Id"
                onChange={(e) => setId(e.target.value)}
                value={id}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
