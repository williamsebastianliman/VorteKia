import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { invoke } from "@tauri-apps/api/core";
import FNBMNavigationBar from "../../components/FNBMNavigationBar";
type Menu = {
  menu_id: string;
  menu_name: string;
  menu_description: string;
  menu_price: Int32Array;
  menu_image: string;
};
function UpdateMenuPage() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
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
      await invoke("update_menu_by_id", {
        id: id,
        name: name,
        description: desc,
        price: price,
        imageData: imageData || [],
      });
      toast.success("Successfully Updating Souvenir Data!");
    } catch (error) {
      toast.error(error as string);
    }
  }
  async function fetchCurrentMenu(id: String) {
    const model: Menu = await invoke("get_menu_by_id", { id });
    setName(model.menu_name);
    setDesc(model.menu_description);
    setPrice(String(model.menu_price));
  }
  useEffect(() => {
    fetchCurrentMenu(id as string);
  }, []);
  return (
    <div className="bg-blue-50">
      <FNBMNavigationBar />
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
            Update Menu
          </h2>
          <h3 className="text-2xl font-bold text-center text-black mb-4">
            {`Menu: ${id}`}
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Menu Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter new souvenir name"
                onChange={(e) => setName(e.target.value)}
                value={name}
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
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
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
                onChange={(e) => setPrice(e.target.value)}
                value={price}
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
              Update Menu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default UpdateMenuPage;
