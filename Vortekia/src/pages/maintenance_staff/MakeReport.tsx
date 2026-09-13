import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate, useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import CNMSNavigationBar from "../../components/CNMSNaivigationBar";

function MakeReport() {
  const { id } = useParams();
  const [reportDesc, setReportDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    invoke("get_maintenance_report_by_id", { id }).then((data: any) => {
      setReportDesc(data.report_description);
      setPreviewUrl("../../" + data.report_image);
    });
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    toast.dismiss();
    event.preventDefault();

    let imageData = null;
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const binaryArray = Array.from(new Uint8Array(arrayBuffer));
      imageData = binaryArray;
    }

    try {
      await invoke("update_maintenance_report_by_id", {
        id,
        description: reportDesc,
        imageData: imageData || [],
        status: "Pending",
      });
      toast.success("Report updated successfully");
      setReportDesc("");
      removeImage();
    } catch (err) {
      toast.error(err as string);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <CNMSNavigationBar />
      <Toaster />
      <button
        className="bg-blue-500 px-4 py-2 rounded-md text-white mt-4 ml-4"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <div className="flex justify-center items-center py-10">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Submit Report
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Report Description
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-md resize-none"
                rows={4}
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Upload Report Image
              </label>
              <input
                className="bg-gray-100"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
              />
              {previewUrl && (
                <div className="relative mt-2 w-32 h-32">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MakeReport;
