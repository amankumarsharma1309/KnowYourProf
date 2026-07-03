import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";
import { Navigate } from "react-router-dom";



function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    if (!email) {
        return <Navigate to="/register" replace />;
    }

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/verify-otp", {
                email,
                otp,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            alert("Registration Successful!");

            navigate("/", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleVerify}>

                <h1>Verify OTP</h1>

                <p style={{ marginBottom: "20px" }}>
                    OTP sent to
                    <br />
                    <strong>{email}</strong>
                </p>

                <div className="input-group">
                    <label>OTP</label>

                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </div>

                {error && <p className="error">{error}</p>}

                <button className="login-btn">
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

            </form>
        </div>
    );
}

export default VerifyOTP;