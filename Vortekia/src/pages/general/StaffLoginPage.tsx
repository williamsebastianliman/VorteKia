import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import ReturnNavigationBar from "../../components/ReturnNavigationBar";
type LoginResponse = {
  message: string;
  redirect_url: string;
};

function StaffLogin() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toast.dismiss();
    try {
      const response: LoginResponse = await invoke("staff_login", {
        id,
        password,
      });
      navigate(response.redirect_url);
    } catch (err) {
      toast.error(err as string);
    }
  };
  return (
    <div>
      <Toaster />
      <div className="flex justify-center items-center min-h-screen  bg-blue-50">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Staff Login
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Staff ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter your Staff Id"
                onChange={(e) => setId(e.target.value)}
                value={id}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
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
export default StaffLogin;
