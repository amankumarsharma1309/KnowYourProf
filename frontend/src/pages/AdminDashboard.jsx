import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const role = localStorage.getItem("role");

    if (role !== "admin") {
      navigate("/admin-login");
      return;
    }

    fetchPendingReviews();

  }, []);

  const fetchPendingReviews = async () => {

    try {

      const res = await api.get("/reviews/pending");

      setReviews(res.data);

    } catch (err) {

      console.log(err);

    }

  };
  const approveReview = async (id) => {

    try {

      await api.put(`/reviews/${id}/approve`);

      fetchPendingReviews();

    } catch (err) {

      console.log(err);

      alert("Failed to approve review.");

    }

  };

  const rejectReview = async (id) => {

    try {

      await api.put(`/reviews/${id}/reject`);

      fetchPendingReviews();

    } catch (err) {

      console.log(err);

      alert("Failed to reject review.");

    }

  };

  return (
    <div className="admin-dashboard">
      <div className="admin-navbar">

        <Link
          to="/"
          className="admin-logo"
        >
          🎓 Professor Insight
        </Link>

      </div>

      <h1>Admin Dashboard</h1>

      <p className="pending-count">
        {reviews.length} Pending Review{reviews.length !== 1 ? "s" : ""}
      </p>

      {reviews.map((review) => (

        <div
          key={review._id}
          className="review-box"
        >

          <div className="review-header">

            <div>

              <h2>{review.courseName}</h2>

              <p>
                <strong>Professor:</strong> {review.professorId.name}
              </p>

            </div>

            <span>
              ⭐ {review.overallRating}/5
            </span>

          </div>

          <div className="review-info">

            <p>
              <strong>Semester:</strong> {review.semester}
            </p>

            <p>
              <strong>Teaching:</strong> {review.teachingRating}/5 ⭐
            </p>

          </div>

          <div className="review-text">

            {review.reviewText}

          </div>

          <div className="action-buttons">

            <button
              className="approve-btn"
              onClick={() => approveReview(review._id)}
            >
              ✅ Approve
            </button>

            <button
              className="reject-btn"
              onClick={() => rejectReview(review._id)}
            >
              ❌ Reject
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}

export default AdminDashboard;