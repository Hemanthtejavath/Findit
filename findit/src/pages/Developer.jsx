import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import DeveloperProfileContent from "../components/DeveloperProfileContent";
import FooterCard from "../components/FooterCard";

function Developer() {
  return (
    <div className="developer-layout">
      <header className="login-nav">
        <div className="login-nav__brand">
          <div className="login-nav__logo">
            <MapPin size={20} strokeWidth={2.2} />
          </div>
          <span>FindIt</span>
        </div>

        <div className="login-nav__actions">
          <Link to="/login" className="login-nav__link">
            Sign In
          </Link>
          <Link to="/register" className="login-nav__link">
            Sign Up
          </Link>
        </div>
      </header>

      <section className="developer-page">
        <DeveloperProfileContent />
      </section>

      <FooterCard />
    </div>
  );
}

export default Developer;
