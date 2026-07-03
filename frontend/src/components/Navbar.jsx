import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/", { replace: true });
    };
    return (
        <nav className="navbar">

            <Link to="/" className="logo">
                <h2>KnowYourProf</h2>
            </Link>

            <button
                className="menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`nav-links ${menuOpen ? "active" : ""}`}>

                <Link to="/">Home</Link>

                {
                    !token && (
                        <>
                            <Link to="/admin-login">Admin Login</Link>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )
                }

                {
                    token && role === "admin" && (
                        <Link to="/admin">
                            Dashboard
                        </Link>
                    )
                }

                {
                    token && (
                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    )
                }

            </div>

        </nav>
    );
}

export default Navbar;