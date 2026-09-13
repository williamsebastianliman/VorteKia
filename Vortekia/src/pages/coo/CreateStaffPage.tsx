import toast, { Toaster } from "react-hot-toast";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import COONavigationBar from "../../components/COONavigationBar";

function CreateStaffPage() {
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const handleRegister = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toast.dismiss();

    try {
      const message: string = await invoke<string>("register_new_staff", {
        name: staffName,
        email: staffEmail,
        password: staffPassword,
        role: staffRole,
      });

      setStaffEmail("");
      setStaffName("");
      setStaffPassword("");
      setStaffRole("");
      toast.success(message, {
        duration: 3000,
      });
    } catch (error) {
      console.log("Error:", error);
      toast.error(String(error));
    }
  };
  return (
    <div>
      <COONavigationBar />
      <div className="flex justify-center items-center min-h-screen  bg-blue-50">
        <Toaster />
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Create Staff Account
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Staff Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter your Staff Name"
                onChange={(e) => setStaffName(e.target.value)}
                value={staffName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md "
                placeholder="Enter your password"
                onChange={(e) => setStaffPassword(e.target.value)}
                value={staffPassword}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Email
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md "
                placeholder="Enter new staff email"
                onChange={(e) => setStaffEmail(e.target.value)}
                value={staffEmail}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Role
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter new staff role"
                onChange={(e) => setStaffRole(e.target.value)}
                value={staffRole}
              />
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              onClick={handleRegister}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CreateStaffPage;
