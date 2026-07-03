import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const fullEmail = `${email}@nitkkr.ac.in`;

      const response = await api.post("/auth/login", {
        email: fullEmail,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);

      navigate("/");
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response?.data);

      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>

        <h1>Welcome Back</h1>

        <div className="input-group">
          <label>College Email</label>

          <div className="email-input">
            <input
              type="text"
              placeholder="eg: 123103022"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <span>@nitkkr.ac.in</span>
          </div>
        </div>

        <div className="input-group">
          <label>Password</label>

          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="login-btn" type="submit">
          {loading ? "Logging in..." : "Login"}
        </button>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ marginBottom: "12px", color: "#666" }}>OR</p>

          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const response = await api.post("/auth/google", {
                  credential: credentialResponse.credential,
                  type: "login",
                });

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.user.role);

                navigate("/", { replace: true });

              } catch (err) {
                console.log(err);
                setError(err.response?.data?.message || "Google Login Failed");
              }
            }}
            onError={() => {
              console.log("Google Login Failed");
            }}
          />
        </div>

        <p className="register-text">
          Don't have an account?
          <span onClick={() => navigate("/register")}>
            Sign in to KnowYourProf
          </span>
        </p>

      </form>
    </div>
  );
}

export default Login;