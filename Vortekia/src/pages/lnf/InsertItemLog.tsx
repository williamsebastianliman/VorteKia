import toast, { Toaster } from "react-hot-toast";
import { useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import LNFNavigationBar from "../../components/LNFNavigationBar";

type Customer = {
  customer_id: string;
  customer_name: string;
};
function InsertItemLog() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleOwnerNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setOwnerName(value);

    if (value.length >= 1) {
      try {
        const results: Customer[] = await invoke(
          "get_customers_by_name_prefix",
          { prefix: value }
        );
        setSuggestions(results);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectOwner = (customer: Customer) => {
    setOwnerName(customer.customer_id);
    setSuggestions([]);
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        console.log(reader.result);
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
  const handleInsert = async (event: React.MouseEvent<HTMLButtonElement>) => {
    toast.dismiss();
    event.preventDefault();
    let imageData = null;

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const binaryArray = Array.from(new Uint8Array(arrayBuffer));
      imageData = binaryArray;
    }

    try {
      await invoke("insert_new_itemlog", {
        name,
        itemType: type,
        color,
        location,
        imageData: imageData || [],
        ownerId: ownerName,
      });

      toast.success("Item log added successfully!");
      setName("");
      setType("");
      setColor("");
      setLocation("");
      setOwnerName("");
      setImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <div>
      <LNFNavigationBar />
      <div className="flex justify-center items-center min-h-screen  bg-blue-50">
        <Toaster />
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Add Item Log
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter item name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                Type
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md "
                placeholder="Enter item type"
                onChange={(e) => setType(e.target.value)}
                value={type}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Color
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md "
                placeholder="Enter item color"
                onChange={(e) => setColor(e.target.value)}
                value={color}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Location
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter item location"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-black">
                Owner ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter Owner ID"
                onChange={handleOwnerNameChange}
                value={ownerName}
              />
              {suggestions.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 mt-1 w-full rounded-md shadow-md z-10">
                  {suggestions.map((customer) => (
                    <li
                      key={customer.customer_id}
                      onClick={() => selectOwner(customer)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {customer.customer_id}: {customer.customer_name}
                    </li>
                  ))}
                </ul>
              )}
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
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default InsertItemLog;
