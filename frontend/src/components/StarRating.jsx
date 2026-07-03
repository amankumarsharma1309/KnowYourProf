function StarRating({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        fontSize: "32px",
        cursor: "pointer"
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          style={{
            color: star <= value ? "#fbbf24" : "#d1d5db",
            transition: ".2s"
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;