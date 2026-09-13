import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import RMNavigationBar from "../../components/RMNavigationBar";
import toast, { Toaster } from "react-hot-toast";
import { invoke } from "@tauri-apps/api/core";
type Souvenir = {
  souvenir_id: string;
  souvenir_name: string;
  souvenir_description: string;
  souvenir_price: Int32Array;
  souvenir_stock: Int32Array;
  souvenir_image: string;
};
function UpdateSouvenirPage() {
  const { id } = useParams();
  const [souvenirName, setSouvenirName] = useState("");
  const [souvenirDescription, setSouvenirDescription] = useState("");
  const [souvenirPrice, setSouvenirPrice] = useState("");
  const [souvenirStock, setSouvenirStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  async function handleUpdate(event: React.MouseEvent<HTMLButtonElement>) {
    toast.dismiss();
    event.preventDefault();
    let imageData = null;

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const binaryArray = Array.from(new Uint8Array(arrayBuffer));
      imageData = binaryArray;
    }
    try {
      await invoke("update_souvenir_by_id", {
        id: id,
        name: souvenirName,
        description: souvenirDescription,
        price: souvenirPrice,
        stock: souvenirStock,
        imageData: imageData || [],
      });
      toast.success("Successfully Updating Souvenir Data!");
    } catch (error) {
      toast.error(error as string);
    }
  }
  async function fetchCurrentSouvenir(id: String) {
    const model: Souvenir = await invoke("get_souvenir_by_id", { id });
    setSouvenirName(model.souvenir_name);
    setSouvenirDescription(model.souvenir_description);
    setSouvenirPrice(String(model.souvenir_price));
    setSouvenirStock(String(model.souvenir_stock));
  }
  useEffect(() => {
    fetchCurrentSouvenir(id as string);
  }, []);
  return (
    <div className="bg-blue-50">
      <RMNavigationBar />
      <button
        className="bg-blue-500 px-4 py-2 rounded-md text-white mt-4.5 ml-4.5"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <div className="flex flex-col justify-center items-center min-h-screen  bg-blue-50">
        <Toaster />

        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-1">
            Update Souvenir
          </h2>
          <h3 className="text-2xl font-bold text-center text-black mb-4">
            {`Souvenir: ${id}`}
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Souvenir Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter new souvenir name"
                onChange={(e) => setSouvenirName(e.target.value)}
                value={souvenirName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                Souvenir Description
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-md resize-none"
                placeholder="Enter new souvenir description"
                rows={4}
                onChange={(e) => setSouvenirDescription(e.target.value)}
                value={souvenirDescription}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Souvenir Price
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-md "
                placeholder="Enter new souvenir price"
                onChange={(e) => setSouvenirPrice(e.target.value)}
                value={souvenirPrice}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                Souvenir Stock
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter new souvenir stock"
                onChange={(e) => setSouvenirStock(e.target.value)}
                value={souvenirStock}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Upload Image
              </label>
              <input
                className=" bg-gray-100 "
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
                  <button
                    type="button"
                    onClick={removeImage}
                    className="mt-1 mr-1 absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                  >
                    X
                  </button>
                </div>
              )}
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              onClick={handleUpdate}
            >
              Add Souvenir
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default UpdateSouvenirPage;
