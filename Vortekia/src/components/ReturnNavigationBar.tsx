import { useNavigate } from "react-router";

function ReturnNavigationBar() {
  const navigate = useNavigate();
  return (
    <div className="bg-black flex justify-between items-center p-4">
      <div className="text-white font-bold">Return</div>
      <div className="flex gap-5">
        <button
          className="font-bold text-1xl text-white hover:text-blue-300"
          onClick={() => navigate("/")}
        >
          Return to Root
        </button>
      </div>
    </div>
  );
}
export default ReturnNavigationBar;
