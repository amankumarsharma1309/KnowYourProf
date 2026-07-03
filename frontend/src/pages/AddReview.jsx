import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import "./AddReview.css";
import StarRating from "../components/StarRating";

function AddReview() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseName: "",
    semester: "",
    overallRating: 0,
    teachingRating: 0,
    attendancePolicy: "",
    proxyPolicy: "",
    paperDifficulty: "",
    paperPattern: "",
    internalMarks: "",
    assignmentLoad: "",
    wouldRecommend: true,
    reviewText: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };
  const handleSubmit = async (e) => {
    

    e.preventDefault();
    setLoading(true);

    try {

      await api.post("/reviews", {
        professorId: id,
        ...formData
      });

      alert("Review submitted successfully! It is now pending admin approval(usually takes a few minutes).");

      navigate(`/professor/${id}`);
    } catch (err) {
      console.log(err);
      console.log(err.response);

      alert(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="add-review">

      <form
        className="review-form"
        onSubmit={handleSubmit}
      >

        <h1>Write a Review</h1>

        <div className="form-row">

          <div className="form-group">
            <label>Course Name</label>

            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="e.g. DBMS"
              required
            />
          </div>

          <div className="form-group">
            <label>Semester</label>

            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
            >
              <option value="">Select Semester</option>

              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>

        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Overall Rating</label>

            <StarRating
              value={formData.overallRating}
              onChange={(rating) =>
                setFormData({
                  ...formData,
                  overallRating: rating
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Teaching Rating</label>

            <StarRating
              value={formData.teachingRating}
              onChange={(rating) =>
                setFormData({
                  ...formData,
                  teachingRating: rating
                })
              }
            />
          </div>

        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Attendance Policy</label>

            <select
              name="attendancePolicy"
              value={formData.attendancePolicy}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Very Strict">Very Strict</option>
              <option value="Strict">Strict</option>
              <option value="Moderate">Moderate</option>
              <option value="Relaxed">Relaxed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Proxy Policy</label>

            <select
              name="proxyPolicy"
              value={formData.proxyPolicy}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Never Allowed">Never Allowed</option>
              <option value="Warning if Caught">Warning if Caught</option>
              <option value="Usually Ignored">Usually Ignored</option>
            </select>
          </div>

        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Exam Difficulty</label>

            <select
              name="paperDifficulty"
              value={formData.paperDifficulty}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Paper Pattern</label>

            <select
              name="paperPattern"
              value={formData.paperPattern}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Mostly PYQs">Mostly PYQs</option>
              <option value="Conceptual">Conceptual</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Internal Marks</label>

            <select
              name="internalMarks"
              value={formData.internalMarks}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Generous">Generous</option>
              <option value="Fair">Fair</option>
              <option value="Strict">Strict</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assignment Load</label>

            <select
              name="assignmentLoad"
              value={formData.assignmentLoad}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Very Low">Very Low</option>
              <option value="Moderate">Moderate</option>
              <option value="Heavy">Heavy</option>
            </select>
          </div>

        </div>

        <div className="form-group checkbox">

          <label>

            <input
              type="checkbox"
              name="wouldRecommend"
              checked={formData.wouldRecommend}
              onChange={handleChange}
            />

            Positive Student Opinion

          </label>

        </div>

        <div className="form-group">

          <label>Your Review</label>

          <textarea
            name="reviewText"
            value={formData.reviewText}
            onChange={handleChange}
            placeholder="Share your experience with this professor..."
          />

        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>

      </form>

    </div>
  );
}

export default AddReview;