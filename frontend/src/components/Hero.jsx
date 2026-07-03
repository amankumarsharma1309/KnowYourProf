import "./Hero.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function Hero({
  search,
  setSearch,
  professors,
  selectedIndex,
  setSelectedIndex
}) {
  const navigate = useNavigate();
  const handleKeyDown = (e) => {

    if (!search) return;

    if (e.key === "ArrowDown") {

      e.preventDefault();

      setSelectedIndex((prev) =>
        Math.min(prev + 1, professors.length - 1)
      );

    }

    else if (e.key === "ArrowUp") {

      e.preventDefault();

      setSelectedIndex((prev) =>
        Math.max(prev - 1, 0)
      );

    }

    else if (e.key === "Enter") {

      if (selectedIndex >= 0) {

        setSearch("");

        navigate(`/professor/${professors[selectedIndex]._id}`);

      }

    }

  };
  return (
    <section className="hero">

      <div className="hero-content">

        <h1>KnowYourProf</h1>

        <p>
          Discover honest reviews, ratings, and experiences shared by students.
        </p>

        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by professor name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
          />
          {search && (
            <div className="search-results">

              {professors.length > 0 ? (

                professors.map((professor, index) => (

                  <div
                    key={professor._id}
                    className={`search-item ${selectedIndex === index ? "active-search" : ""
                      }`}
                    onClick={() => {
                      setSearch("");
                      navigate(`/professor/${professor._id}`);
                    }}
                  >
                    {professor.name}
                  </div>

                ))

              ) : (

                <div className="search-item">
                  No matching professors found.
                </div>

              )}

            </div>
          )}
        </div>

      </div>

    </section>
  );
}

export default Hero;