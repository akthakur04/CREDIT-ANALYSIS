import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Mortgage from "./pages/mortgage";
import Login from "./components/Login";
import Header from "./components/Header"; // MUI Header component
import Register from "./components/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/validate", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Validation failed", error);
      }
      setLoading(false);
    };

    validateUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Mortgage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
