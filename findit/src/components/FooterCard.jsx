import { Link } from "react-router-dom";
import {
  ArrowRight,
  Code2,
  HeartHandshake,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

function FooterCard() {
  return (
    <footer className="footer-card">
      <div className="footer-card__inner">
        <div className="footer-card__glow footer-card__glow--left" />
        <div className="footer-card__glow footer-card__glow--right" />

        <div className="footer-card__top">
          <div className="footer-card__brand">
            <div className="footer-card__logo">
              <MapPin size={22} strokeWidth={2.2} />
            </div>

            <div className="footer-card__copy">
              <span className="footer-card__eyebrow">FindIt</span>
              <h2>Lose less. Find faster.</h2>
              <p>Campus recovery, simplified.</p>
            </div>
          </div>

          <div className="footer-card__stats">
            <article className="footer-card__stat">
              <Sparkles size={16} />
              <div>
                <strong>Post fast</strong>
                <span>Clear reports</span>
              </div>
            </article>

            <article className="footer-card__stat">
              <HeartHandshake size={16} />
              <div>
                <strong>Recover safely</strong>
                <span>Trusted handovers</span>
              </div>
            </article>

            <article className="footer-card__stat">
              <Mail size={16} />
              <div>
                <strong>Stay connected</strong>
                <span>Useful updates</span>
              </div>
            </article>
          </div>

          <Link to="/developer" className="footer-card__signature">
            <div className="footer-card__signature-mark">
              <Code2 size={16} />
            </div>
            <div className="footer-card__signature-copy">
              <span>Made by</span>
              <strong>Hemanth Tejavath</strong>
            </div>
            <div className="footer-card__signature-action">
              <span>Profile</span>
              <ArrowRight size={15} />
            </div>
          </Link>
        </div>

        <div className="footer-card__bottom">
          <p>Built for smarter campus recovery.</p>
          <Link to="/developer" className="footer-card__link footer-card__link--accent">
            By Hemanth Tejavath
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default FooterCard;
