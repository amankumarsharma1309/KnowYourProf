import "./ProfessorCard.css";
import { FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ProfessorCard({ professor }) {
    const navigate = useNavigate();
    return (
        <div
            className="professor-card"
            onClick={() => navigate(`/professor/${professor._id}`)}
        >

            <div className="avatar">
                <FaUserTie />
            </div>

            <h2>{professor.name}</h2>

            <p className="designation">
                {professor.designation}
            </p>

            <span className="department">
                {professor.department}
            </span>

            <div className="card-stats">

                <span>
                    ⭐ {professor.averageRating.toFixed(1)}
                </span>

                <span>
                    📝 {professor.reviewCount} Reviews
                </span>

            </div>

            <button
                className="view-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/professor/${professor._id}`);
                }}
            >
                View Profile →
            </button>

        </div>
    );
}

export default ProfessorCard;