import { useEffect, useState } from "react";
import api from "../services/api";
import "./ProfessorDetails.css";
import ReviewCard from "../components/ReviewCard";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ProfessorDetails() {
  const [professor, setProfessor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const professorResponse = await api.get(`/professors/${id}`);
        setProfessor(professorResponse.data);

        const reviewResponse = await api.get(`/reviews/professor/${id}`);
        setReviews(reviewResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfessor();
  }, [id]);

  if (!professor) {
    return <h2>Loading...</h2>;
  }

  const averageRating =
    reviews.length > 0
      ? (
        reviews.reduce(
          (sum, review) => sum + review.overallRating,
          0
        ) / reviews.length
      ).toFixed(1)
      : "No Ratings";

  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((review) => {
    ratingCounts[review.overallRating]++;
  });

  let verdictEmoji = "";

  if (professor.recommendationPercentage >= 90)
    verdictEmoji = "😍";
  else if (professor.recommendationPercentage >= 75)
    verdictEmoji = "😊";
  else if (professor.recommendationPercentage >= 60)
    verdictEmoji = "🙂";
  else if (professor.recommendationPercentage >= 40)
    verdictEmoji = "😐";
  else if (professor.recommendationPercentage >= 20)
    verdictEmoji = "😕";
  else
    verdictEmoji = "😖";

  const courses = [...new Set(reviews.map((review) => review.courseName))];

  return (
    <div className="professor-details">

      <div className="professor-header">

        <div className="professor-avatar">
          👨‍🏫
        </div>

        <h1>{professor.name}</h1>

        <span className="department-badge">
          {professor.department}
        </span>

        <div className="rating-summary">
          <h3>⭐ {averageRating}</h3>
          <p>
            {reviews.length} Review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
        {token ? (

          <Link to={`/add-review/${professor._id}`}>
            <button className="review-btn">
              ✍️ Write a Review
            </button>
          </Link>

        ) : (

          <button
            className="review-btn"
            onClick={() => {
              alert("Please Login/Register to write a review.");
              navigate("/login");
            }}
          >
            ✍️ Share Your Experience
          </button>

        )}

      </div>

      <div className="summary-card">

        <h2>Professor Summary</h2>

        <p className="summary-subtitle">
          Insights based on {professor.reviewCount} approved review
          {professor.reviewCount !== 1 ? "s" : ""}
        </p>

        <div className="summary-grid">

          <div className="summary-item">
            <span>Attendance</span>
            <strong>🟠 {professor.attendanceSummary}</strong>
          </div>

          <div className="summary-item">
            <span>Exam Difficulty</span>
            <strong>🟢 {professor.paperDifficultySummary}</strong>
          </div>

          <div className="summary-item">
            <span>Internal Marks</span>
            <strong>🟢 {professor.internalMarksSummary}</strong>
          </div>

          <div className="summary-item">
            <span>Assignments</span>
            <strong>🟡 {professor.assignmentLoadSummary}</strong>
          </div>

          <div className="summary-item">
            <span>Proxy</span>
            <strong>🟠 {professor.proxyPolicySummary}</strong>
          </div>

          <div className="summary-item">
            <span>Student Opinion</span>
            <strong>
              {verdictEmoji} {professor.recommendationPercentage}% Positive
            </strong>
          </div>

        </div>

      </div>

      <div className="rating-breakdown">

        <h2>Rating Distribution</h2>

        {[5, 4, 3, 2, 1].map((star) => (
          <div
            key={star}
            className="rating-row"
          >

            <span>
              {"★".repeat(star)}
              {"☆".repeat(5 - star)}
            </span>

            <div className="rating-bar">
              <div
                className="rating-fill"
                style={{
                  width:
                    reviews.length === 0
                      ? "0%"
                      : `${(ratingCounts[star] / reviews.length) * 100}%`,
                }}
              />
            </div>

            <span>
              {reviews.length === 0
                ? "0%"
                : `${Math.round(
                  (ratingCounts[star] / reviews.length) * 100
                )}%`}
            </span>

          </div>
        ))}

      </div>

      <div className="popular-tags">

        <h2>Popular Tags</h2>

        <div className="tags">

          <span className="tag strict">
            🔴 {professor.attendanceSummary}
          </span>

          <span className="tag moderate">
            🟡 {professor.assignmentLoadSummary}
          </span>

          <span className="tag easy">
            🟢 {professor.internalMarksSummary}
          </span>

          <span className="tag easy">
            🟢 {professor.paperDifficultySummary}
          </span>

          <span className="tag strict">
            🔴 {professor.proxyPolicySummary}
          </span>

        </div>

      </div>

      <div className="courses-card">

        <h2>Courses Reviewed</h2>

        <div className="courses-list">

          {courses.map((course) => (
            <span
              key={course}
              className="course-chip"
            >
              📘 {course}
            </span>
          ))}

        </div>

      </div>

      <div className="reviews-section">

        <h2>Reviews</h2>

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
            />
          ))
        )}

      </div>

    </div>
  );
}

export default ProfessorDetails;