import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";

interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [username, setusername] = useState("");
  const [password_hash, setpassword_hash] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`${process.env.REACT_APP_API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "username":username, "password_hash":password_hash }),
    });

    const data = await response.json()
    console.log(data);
    if (response.ok ) {
      localStorage.setItem("token", data.access_token);
      setIsAuthenticated(true);
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="pt-[100px] flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password_hash"
            placeholder="password_hash"
            value={password_hash}
            onChange={(e) => setpassword_hash(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <Separator className="my-4" />

        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
