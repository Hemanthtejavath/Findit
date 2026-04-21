import { useState } from "react";
import Cookies from "js-cookie";
import {
  Eye,
  EyeOff,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FooterCard from "../components/FooterCard";
import api from "../services/api";

const featureCards = [
  {
    title: "Faster recovery",
    description: "Find nearby reports without jumping across random groups.",
    icon: ShieldCheck,
  },
  {
    title: "Cleaner search",
    description: "Track lost, found, and completed items in one simple place.",
    icon: Search,
  },
  {
    title: "Safer handovers",
    description: "Use clear item details before you contact the right person.",
    icon: TimerReset,
  },
];

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const { email, password } = form;

    if (!email || !password) {
      return "Please fill in all fields.";
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", form);
      Cookies.set("jwt_token", data.token, { expires: 7 });
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
        }),
      );

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <header className="login-nav">
        <div className="login-nav__brand">
          <div className="login-nav__logo">
            <MapPin size={20} strokeWidth={2.2} />
          </div>
          <span>FindIt</span>
        </div>

        <div className="login-nav__actions">
          <span className="login-nav__current">Sign In</span>
          <Link to="/register" className="login-nav__link">
            Sign Up
          </Link>
        </div>
      </header>

      <div className="login-shell">
        <div className="login-column">
          <div className="login-hero">
            <span className="login-hero__eyebrow">Find what matters</span>
            <h1>Sign in and get back to faster campus recovery.</h1>
            <p>
              Report lost items, browse found posts, and reconnect with your
              belongings through one cleaner space.
            </p>
          </div>

          <div className="login-card">
            <div className="login-brand">
              <div className="login-brand__icon">
                <KeyRound size={20} strokeWidth={2.1} />
              </div>
              <div>
                <h2>Welcome back</h2>
                <p>Use the same details you registered with.</p>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-field">
                <span>Email Address</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>

              <label className="login-field">
                <span>Password</span>
                <div className="login-password">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="login-password__toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span> Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="login-footer">
              New to FindIt? <Link to="/register">Create account</Link>
            </p>
          </div>

          <div className="login-features">
            <p className="login-features__title">Why students choose FindIt</p>
            {featureCards.map(({ title, description, icon: Icon }) => (
              <article key={title} className="login-feature">
                <div className="login-feature__icon">
                  <Icon size={16} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <FooterCard />
    </div>
  );
}

export default Login;
