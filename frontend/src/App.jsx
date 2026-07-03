import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import VerifyOTP from "./pages/VerifyOTP";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfessorDetails from "./pages/ProfessorDetails";
import AddReview from "./pages/AddReview";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/professor/:id" element={<ProfessorDetails />} />
        <Route path="/add-review/:id" element={<AddReview />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
      </Routes>
    </>
  );
}

export default App;