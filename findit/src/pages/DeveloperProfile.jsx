import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import DeveloperProfileContent from "../components/DeveloperProfileContent";
import Navbar from "../components/Navbar";

function DeveloperProfile() {
  return (
    <div className="developer-profile-layout">
      <Navbar />

      <section className="developer-profile-page">
        <div className="developer-profile-shell">
          <Link to="/" className="developer-profile-back">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <DeveloperProfileContent />
        </div>
      </section>
    </div>
  );
}

export default DeveloperProfile;
