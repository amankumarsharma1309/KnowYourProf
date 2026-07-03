import "./StarRating.css";

function StarRating({ value, onChange }) {

    return (

        <div className="star-rating">

            {[1, 2, 3, 4, 5].map((star) => (

                <span
                    key={star}
                    className={`star ${star <= value ? "active" : ""}`}
                    onClick={() => onChange(star)}
                >
                    ★
                </span>

            ))}

        </div>

    );

}

export default StarRating;