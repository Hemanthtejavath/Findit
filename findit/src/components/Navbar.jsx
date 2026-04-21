import { Code2, LogOut, MapPin, Plus, User } from "lucide-react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  const navigate = useNavigate();
  const onhandleLogout = () => {
    Cookies.remove("jwt_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <div className="navbar__logo">
            <MapPin size={20} strokeWidth={2.2} />
          </div>
          <span className="navbar__title">FindIt</span>
        </div>

        <div className="navbar__actions">
          <Link to="/report">
            <button
              type="button"
              className="navbar__action navbar__action--primary"
            >
              <Plus size={18} />
              <span>Report</span>
            </button>
          </Link>

          <Link to="/profile">
            <div className="navbar__profile">
              <div className="navbar__avatar" aria-label="Profile">
                <User size={16} />
              </div>
            </div>
          </Link>

          <Link to="/developer-profile">
            <button
              type="button"
              className="navbar__action navbar__action--icon"
              aria-label="Developer profile"
            >
              <Code2 size={18} />
            </button>
          </Link>

          <button
            type="button"
            className="navbar__action navbar__action--icon"
            aria-label="Log out"
            onClick={onhandleLogout}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
