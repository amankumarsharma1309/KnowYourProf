import "./ReviewCard.css";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { BiLike, BiDislike } from "react-icons/bi";

function ReviewCard({ review }) {
  const reviewTitle = () => {

    if (review.overallRating === 5) return "Excellent Teacher";

    if (review.overallRating === 4) return "Very Good";

    if (review.overallRating === 3) return "Good";

    if (review.overallRating === 2) return "Average";

    return "Poor";
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

        <button className="action-btn">

          <BiLike />

          Helpful {review.helpfulCount > 0 && `(${review.helpfulCount})`}

        </button>

        <button className="action-btn">

          <BiDislike />

          {review.notHelpfulCount > 0 && review.notHelpfulCount}

        </button>

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