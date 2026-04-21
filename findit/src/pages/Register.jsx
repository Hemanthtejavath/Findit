import { useState } from "react";
import {
  BellRing,
  Eye,
  EyeOff,
  Images,
  KeyRound,
  Layers3,
  MapPin,
  MessageSquareOff,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FooterCard from "../components/FooterCard";
import api from "../services/api";

const futureUpgradeCards = [
  {
    icon: KeyRound,
    title: "Code verification handover",
    description:
      "Generate a one-time pickup code so both people confirm the item was handed over to the right person.",
  },
  {
    icon: ShieldCheck,
    title: "Real identity confirmation",
    description:
      "Add simple identity checks before sensitive handovers to reduce fake claims and confusion.",
  },
  {
    icon: Images,
    title: "Lost and found photo matching",
    description:
      "Detect similar item images and surface likely matches faster when two posts look related.",
  },
  {
    icon: BellRing,
    title: "Automatic match alerts",
    description:
      "Notify users when a new lost or found report closely matches their item details, photo, or campus area.",
  },
  {
    icon: ShieldCheck,
    title: "Claim confidence checks",
    description:
      "Ask the claimant for key item details before handover so recovery feels safer and more trustworthy.",
  },
  {
    icon: Search,
    title: "Smarter item discovery",
    description:
      "Highlight likely matches based on title, location, time, image, and campus context instead of basic search alone.",
  },
];

const whyUseCards = [
  {
    icon: MessageSquareOff,
    title: "No more group-message confusion",
    description:
      "Stop searching through old chats and repeated forwards just to find one lost or found update.",
  },
  {
    icon: RefreshCw,
    title: "Update once, reach the right people",
    description:
      "Post a report once and keep it updated in one place instead of manually sharing the same message everywhere.",
  },
  {
    icon: Layers3,
    title: "Lost and found in one organized flow",
    description:
      "Keep reports, status changes, and handover progress inside one structured space that is easier to trust.",
  },
  {
    icon: Search,
    title: "Faster discovery for real matches",
    description:
      "Search by item, place, and campus details so the right report is easier to discover at the right time.",
  },
  {
    icon: BellRing,
    title: "Useful alerts instead of missed updates",
    description:
      "Get notified when something relevant changes instead of depending on screenshots, forwards, and random replies.",
  },
  {
    icon: ShieldCheck,
    title: "A more trusted recovery process",
    description:
      "From first report to final handover, the whole flow feels clearer, more visible, and easier to manage.",
  },
];

function Register() {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
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
    const { name, email, password } = form;

    if (!name || !email || !password) {
      return "Please fill in all fields.";
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
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
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-layout">
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
          <span className="login-nav__current">Sign Up</span>
        </div>
      </header>

      <section className="register-page">
        <div className="register-hero">
          <span className="register-hero__eyebrow">Start smarter recovery</span>
          <h1>Create your account and join the campus recovery network.</h1>
          <p>
            Sign up once, report faster, and manage lost and found updates in a
            cleaner space.
          </p>
        </div>

        <div className="register-shell">
          <div className="register-card">
            <div className="register-brand">
              <div className="register-brand__icon">
                <UserPlus size={20} strokeWidth={2.1} />
              </div>
              <div className="register-brand__copy">
                <h1>Join FindIt</h1>
                <p>Create your account and start recovering lost items</p>
              </div>
            </div>

            {error && <div className="register-error">{error}</div>}

            <form className="register-form" onSubmit={handleSubmit}>
              <label className="register-field">
                <span>Full Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </label>

              <label className="register-field">
                <span>Email Address</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>

              <label className="register-field">
                <span>Password</span>
                <div className="register-password">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="register-password__toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <small>
                  Use 8+ characters with uppercase, lowercase, number, and
                  special character
                </small>
              </label>

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Creating account...
                  </>
                ) : (
                  "Join FindIt"
                )}
              </button>
            </form>

            <p className="register-footer">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>

          <aside className="register-showcase">
            <div className="register-showcase__eyebrow">
              <Sparkles size={15} />
              <span>Built for smarter item recovery</span>
            </div>

            <h2>One place to report, discover, and recover lost items.</h2>

            <p className="register-showcase__intro">
              FindIt helps students and communities reconnect people with their
              belongings through organized listings, faster discovery, and a
              simpler recovery experience.
            </p>

            <div className="register-benefits">
              <article className="register-benefit">
                <div className="register-benefit__icon">
                  <Search size={18} />
                </div>
                <div>
                  <h3>Fast item reporting</h3>
                  <p>
                    Post lost or found items in seconds with the details that
                    help the right person recognize them quickly.
                  </p>
                </div>
              </article>

              <article className="register-benefit">
                <div className="register-benefit__icon">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3>Better local visibility</h3>
                  <p>
                    Keep discoveries focused and relevant so listings are easier
                    to notice and act on.
                  </p>
                </div>
              </article>

              <article className="register-benefit">
                <div className="register-benefit__icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3>More trust, less confusion</h3>
                  <p>
                    Manage updates in one platform instead of scattered chats,
                    posters, and missed messages.
                  </p>
                </div>
              </article>
            </div>

            <div className="register-stats">
              <div className="register-stat">
                <strong>Simple</strong>
                <span>reporting flow for lost and found items</span>
              </div>
              <div className="register-stat">
                <strong>Clear</strong>
                <span>communication from post creation to recovery</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="register-upgrades">
        <div className="register-upgrades__header">
          <span className="register-upgrades__eyebrow">Future upgrades</span>
          <h2>Safer recovery features built for real handovers.</h2>
          <p>
            FindIt can grow into a stronger recovery platform with verification,
            matching, and trust-focused flows that make each handover feel more
            secure.
          </p>
        </div>

        <div className="register-upgrades__grid">
          <div className="register-upgrades__track">
            {[...futureUpgradeCards, ...futureUpgradeCards].map(
              ({ icon: Icon, title, description }, index) => (
                <article
                  key={`${title}-${index}`}
                  className="register-upgrade-card"
                  aria-hidden={index >= futureUpgradeCards.length}
                >
                  <div className="register-upgrade-card__icon">
                    <Icon size={18} />
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="register-why">
        <div className="register-why__header">
          <span className="register-why__eyebrow">Why use FindIt</span>
          <h2>
            One clear place for lost and found, instead of scattered updates.
          </h2>
          <p>
            When something gets lost, people usually depend on random WhatsApp
            groups, missed forwards, and repeated messages. FindIt gives that
            entire process one cleaner system.
          </p>
        </div>

        <div className="register-why__grid">
          <div className="register-why__track">
            {[...whyUseCards, ...whyUseCards].map(
              ({ icon: Icon, title, description }, index) => (
                <article
                  key={`${title}-${index}`}
                  className="register-why-card"
                  aria-hidden={index >= whyUseCards.length}
                >
                  <div className="register-why-card__icon">
                    <Icon size={18} />
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <FooterCard />
    </div>
  );
}

export default Register;
