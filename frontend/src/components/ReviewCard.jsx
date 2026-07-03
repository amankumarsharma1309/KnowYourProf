import "./ReviewCard.css";
import { useState } from "react";
import api from "../services/api";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { BiLike, BiDislike } from "react-icons/bi";

function ReviewCard({ review }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);

  const [notHelpfulCount, setNotHelpfulCount] = useState(review.notHelpfulCount);
  
  const reviewTitle = () => {

    if (review.overallRating === 5) return "Excellent Teacher";

    if (review.overallRating === 4) return "Very Good";

    if (review.overallRating === 3) return "Good";

    if (review.overallRating === 2) return "Average";

    return "Poor";
  };
  const handleVote = async (vote) => {

    try {

      const token = localStorage.getItem("token");

      const response = await api.post(

        `/reviews/${review._id}/vote`,

        {
          vote
        },

        {
          headers: {
            authorization: token
          }
        }

      );

      setHelpfulCount(response.data.helpfulCount);

      setNotHelpfulCount(response.data.notHelpfulCount);

    }

    catch (error) {

      console.log(error);

      alert(error.response?.data?.message || "Voting failed.");

    }

  };

  return (
    <div className="review-card">

      <div className="review-top">

        <div className="rating">

          <span>{review.overallRating}</span>

          <FaStar className="rating-star" />

        </div>

        <h3 className="review-title">
          {reviewTitle()}
        </h3>

      </div>

      <div className="review-course">
        {review.courseName} • Semester {review.semester}
      </div>

      <div className="review-tags">

        <span className="tag">
          Attendance: {review.attendancePolicy}
        </span>

        <span className="tag">
          Paper: {review.paperDifficulty}
        </span>

        <span className="tag">
          Internals: {review.internalMarks}
        </span>

        <span className="tag">
          Assignments: {review.assignmentLoad}
        </span>

        <span className="tag">
          Proxy: {review.proxyPolicy}
        </span>

        <span className="tag">
          Teaching: {review.teachingRating}/5
        </span>

      </div>

      <p className="review-text">
        {review.reviewText}
      </p>
      <div className="review-actions">

        <div className="review-actions">

          <button
            className="action-btn"
            onClick={() => handleVote("helpful")}
          >

            <BiLike />

            Helpful {helpfulCount > 0 && `(${helpfulCount})`}

          </button>

          <button
            className="action-btn"
            onClick={() => handleVote("notHelpful")}
          >

            <BiDislike />

            Not Helpful {notHelpfulCount > 0 && `(${notHelpfulCount})`}

          </button>

        </div>

      </div>
      <div className="review-footer">

        <BsPatchCheckFill className="verified-icon" />

        <span>
          Verified Student • {new Date(review.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
          })}
        </span>

      </div>

    </div>
  );
}

export default ReviewCard;