import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CSNavigationBar from "../../components/CSNavigationBar";
function CreateCustomerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const handleRegister = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toast.dismiss();

    try {
      const message: string = await invoke<string>("register_new_customer", {
        name,
        email,
        phone,
      });

      setEmail("");
      setName("");
      setPhone("");
      toast.success(message, {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error(String(error));
    }
  };
  return (
    <div>
      <CSNavigationBar />
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <Toaster />
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Customer Registration
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm text-black font-medium">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter customer full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-black font-medium ">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md "
                placeholder="Enter customer phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-black font-medium">
                Email
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter customer email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

export default CreateCustomerPage;
