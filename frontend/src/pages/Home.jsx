import { useState, useEffect } from "react";
import ProfessorCard from "../components/ProfessorCard";
import api from "../services/api";
import Hero from "../components/Hero";
import "./Home.css";
import Footer from "../components/Footer";
function Home() {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [professors, setProfessors] = useState([]);
  const fetchProfessors = async () => {
    try {
      const response = await api.get("/professors");
      setProfessors(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchStats = async () => {

    try {

      const response = await api.get("/professors/stats");

      setStats(response.data);

    } catch (error) {

      console.log(error);

    }

  };
  const [stats, setStats] = useState({
    professorCount: 0,
    reviewCount: 0,
    averageRating: 0
  });

  const [search, setSearch] = useState("");
  useEffect(() => {

    fetchProfessors();

    fetchStats();

  }, []);

  const filteredProfessors = professors.filter((professor) =>
    professor.name.toLowerCase().includes(search.toLowerCase())
  );

  console.log("Search:", search);
  console.log("Filtered:", filteredProfessors.length);
  console.log(filteredProfessors);

  return (
    <>
      <Hero
        search={search}
        setSearch={setSearch}
        professors={filteredProfessors}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      <section className="stats-section">

        <div className="stats-card">
          <h2>👨‍🏫</h2>
          <h3>{stats.professorCount}</h3>
          <p>Professors</p>
        </div>

        <div className="stats-card">
          <h2>📝</h2>
          <h3>{stats.reviewCount}</h3>
          <p>Reviews</p>
        </div>

        <div className="stats-card">
          <h2>⭐</h2>
          <h3>{stats.averageRating}</h3>
          <p>Average Rating</p>
        </div>

      </section>

      <section className="professor-section">

        <div className="section-header">
          <h2>Featured Professors</h2>
          <p>Browse professors reviewed by students.</p>
        </div>

        <div className="carousel">

          <div className="carousel-track">

            {[...professors, ...professors].map((professor, index) => (
              <ProfessorCard
                key={index}
                professor={professor}
              />
            ))}

          </div>

        </div>

      </section>

      <Footer />

    </>
  );
}

export default Home;