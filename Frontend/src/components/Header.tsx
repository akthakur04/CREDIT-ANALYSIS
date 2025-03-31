import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <header className="w-full   fixed bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Mortgage App</h1>
      <nav>
        {isAuthenticated ? (
          <button
            className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-200"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
