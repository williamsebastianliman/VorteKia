import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import LNFNavigationBar from "../../components/LNFNavigationBar";

function UpdateItemLog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemlog_name: "",
    itemlog_type: "",
    itemlog_color: "",
    itemlog_location: "",
    customer_id: "",
    itemlog_status: "Missing",
  });

  const [existingImagePath, setExistingImagePath] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchItemLog();
  }, [id]);

  const fetchItemLog = async () => {
    try {
      const result = await invoke("get_itemlog_by_id", { id });
      const data = result as any;
      setForm({
        itemlog_name: data.itemlog_name,
        itemlog_type: data.itemlog_type,
        itemlog_color: data.itemlog_color,
        itemlog_location: data.itemlog_location,
        customer_id: data.customer_id,
        itemlog_status: data.itemlog_status,
      });
      setExistingImagePath(data.itemlog_image);
    } catch {
      toast.error("Failed to fetch item log data.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    toast.dismiss();

    try {
      let imageData: number[] | null = null;

      if (newImageFile) {
        const arrayBuffer = await newImageFile.arrayBuffer();
        imageData = Array.from(new Uint8Array(arrayBuffer));
      }

      await invoke("update_itemlog_all_by_id", {
        id,
        name: form.itemlog_name,
        itemType: form.itemlog_type,
        color: form.itemlog_color,
        location: form.itemlog_location,
        customerId: form.customer_id,
        status: form.itemlog_status,
        imageData,
      });

      if (form.itemlog_status === "Found") {
        await invoke("insert_notification", {
          customerId: form.customer_id,
          message: `Your item "${form.itemlog_name}" has been marked as Found.`,
        });
      }

      toast.success("ItemLog updated!");
      navigate("/staff/lnf/viewlog");
    } catch (err) {
      toast.error(err as string);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <LNFNavigationBar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Toaster />
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-6 text-center underline text-black">
            Update ItemLog
          </h1>

          <div className="space-y-4 text-black">
            <input
              type="text"
              name="itemlog_name"
              value={form.itemlog_name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border rounded px-4 py-2"
            />
            <input
              type="text"
              name="itemlog_type"
              value={form.itemlog_type}
              onChange={handleChange}
              placeholder="Type"
              className="w-full border rounded px-4 py-2"
            />
            <input
              type="text"
              name="itemlog_color"
              value={form.itemlog_color}
              onChange={handleChange}
              placeholder="Color"
              className="w-full border rounded px-4 py-2"
            />
            <input
              type="text"
              name="itemlog_location"
              value={form.itemlog_location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full border rounded px-4 py-2"
            />
            <input
              type="text"
              name="customer_id"
              value={form.customer_id}
              onChange={handleChange}
              placeholder="Owner (Customer ID)"
              className="w-full border rounded px-4 py-2"
            />
            <select
              name="itemlog_status"
              value={form.itemlog_status}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            >
              <option value="Missing">Missing</option>
              <option value="Found">Found</option>
              <option value="Returned">Returned</option>
            </select>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload New Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded px-4 py-2"
              />
              {(previewImage || existingImagePath) && (
                <img
                  src={previewImage || `../../${existingImagePath}`}
                  alt="Item Preview"
                  className="mt-4 w-full h-48 object-cover rounded"
                />
              )}
            </div>

            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateItemLog;
