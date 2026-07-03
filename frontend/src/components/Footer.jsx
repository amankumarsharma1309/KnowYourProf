import "./Footer.css";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <h2>KnowYourProf</h2>

        <p className="footer-description">
          Helping NIT Kurukshetra students make informed academic decisions through honest reviews and real experiences.
        </p>

        <div className="footer-info">

          <div className="footer-item">
            🏫 Built for NIT Kurukshetra
          </div>

          <div className="footer-item">
            👨‍💻 Developed by an Anonymous Guy
          </div>

        </div>

        <div className="footer-social">

          <a href="mailto:chukundrasharma77187@gmail.com">
            <FaEnvelope />
          </a>

          {/* <a
            href="https://github.com/amankumarsharma1309/"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub />
          </a> */}

          <a
            href="https://linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin />
          </a>

        </div>

        <p className="copyright">
          © 2026 Professor Insight. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;