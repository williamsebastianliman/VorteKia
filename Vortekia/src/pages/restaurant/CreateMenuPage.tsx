import { invoke } from "@tauri-apps/api/core";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import RMNavigationBar from "../../components/RMNavigationBar";

type Restaurant = {
  restaurant_id: string;
  restaurant_name: string;
};

function CreateMenuPage() {
  const { id } = useParams();
  const [restaurantName, setRestaurantName] = useState("");
  const [menuName, setMenuName] = useState("");
  const [menuDesc, setMenuDesc] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  async function fetchRestaurantName() {
    const data: Restaurant = await invoke("get_restaurant_by_id", { id });
    console.log(data);
    setRestaurantName(data.restaurant_name);
  }

  async function handleInsert(event: React.MouseEvent<HTMLButtonElement>) {
    toast.dismiss();
    event.preventDefault();
    let imageData = null;

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const binaryArray = Array.from(new Uint8Array(arrayBuffer));
      imageData = binaryArray;
    }
    try {
      console.log(id);
      await invoke("insert_menu", {
        name: menuName,
        description: menuDesc,
        price: menuPrice,
        imageData: imageData || [],
        restaurantId: id,
      });
      toast.success("Successfully Inserting New Souvenir");
      setMenuName("");
      setMenuDesc("");
      setMenuPrice("");
      removeImage();
      setImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(error as string);
    }
  }
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
  useEffect(() => {
    fetchRestaurantName();
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
            Add New Menu
          </h2>
          <h3 className="text-2xl font-bold text-center text-black mb-4">
            {`Restaurant: ${restaurantName}`}
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Menu Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter new menu name"
                onChange={(e) => setMenuName(e.target.value)}
                value={menuName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                Menu Description
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-md resize-none"
                placeholder="Enter new menu description"
                rows={4}
                onChange={(e) => setMenuDesc(e.target.value)}
                value={menuDesc}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Menu Price
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-md "
                placeholder="Enter new menu price"
                onChange={(e) => setMenuPrice(e.target.value)}
                value={menuPrice}
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
              onClick={handleInsert}
            >
              Add Menu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CreateMenuPage;
