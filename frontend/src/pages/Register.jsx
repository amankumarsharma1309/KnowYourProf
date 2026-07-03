import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../services/api";
import "./Login.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const fullEmail = `${email}@nitkkr.ac.in`;

      await api.post("/auth/send-otp", {
        name,
        email: fullEmail,
        password,
      });

      navigate("/verify-otp", {
        state: {
          email: fullEmail,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleRegister}>

        <h1>Join KnowYourProf</h1>

        <div className="input-group">
          <label>Name</label>

          <input
            className="name-input"
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>College Email</label>

          <div className="email-input">
            <input
              type="text"
              placeholder="123103022"
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

        <div className="input-group">
          <label>Confirm Password</label>

          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="login-btn" type="submit">
          {loading ? "Sending OTP..." : "Register"}
        </button>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ marginBottom: "12px", color: "#666" }}>OR</p>

          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const response = await api.post("/auth/google", {
                  credential: credentialResponse.credential,
                  type: "register",
                });

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("role", response.data.user.role);

                navigate("/", { replace: true });

              } catch (err) {
                setError(
                  err.response?.data?.message || "Google Registration Failed"
                );
              }
            }}
            onError={() => {
              setError("Google Registration Failed");
            }}
          />
        </div>

        <p className="register-text">
          Already have an account?
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </form>
    </div>
  );
}

export default Register;