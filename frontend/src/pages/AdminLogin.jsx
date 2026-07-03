import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminLogin.css";

function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await api.post("/auth/login", {
        email,
        password
      });
      if (res.data.user.role !== "admin") {

        alert("Only admins can login here.");

        return;
      }


      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);


      navigate("/admin");

    } catch (err) {

      alert(err.response?.data?.message || "Login failed");

    }

  };

  return (

    <div className="admin-login-page">

      <form
        className="admin-login-card"
        onSubmit={handleSubmit}
      >

        <h1>Admin Login</h1>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Login
        </button>

      </form>

    </div>

  );

}

export default AdminLogin;