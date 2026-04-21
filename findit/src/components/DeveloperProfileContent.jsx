import { useState } from "react";
import { Code2, ExternalLink, Lightbulb, Mail, Rocket } from "lucide-react";

function DeveloperProfileContent({ className = "", showHero = true }) {
  const classes = ["developer-shell", className].filter(Boolean).join(" ");
  const [imageError, setImageError] = useState(false);

  return (
    <div className={classes}>
      {showHero && (
        <div className="developer-hero">
          <span className="developer-hero__eyebrow">Creator & Project</span>
          <h1>
            Built to make campus recovery simpler, faster, and more human.
          </h1>
          <p>
            FindIt is a focused lost and found platform designed and built by
            Hemanth Tejavath to reduce chaos around reporting, searching, and
            reconnecting with important belongings.
          </p>
        </div>
      )}

      <div className="developer-photo-wrap">
        <div className="developer-avatar developer-avatar--hero">
          {!imageError ? (
            <img
              src="/developer_1.jpeg"
              alt="Hemanth Tejavath"
              className="developer-avatar__image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="developer-avatar__placeholder">Add your photo</div>
          )}
        </div>
      </div>

      <section className="developer-card developer-card--intro">
        <div className="developer-profile">
          <div className="developer-copy">
            <span className="developer-copy__eyebrow">Developer</span>
            <h2>Hemanth Tejavath</h2>
            <p>
              Full-stack builder focused on practical products, clean UI, and
              useful real-world software. IIT PATNA- 2027
            </p>
          </div>
        </div>

        <div className="developer-links">
          <a
            href="https://github.com/Hemanthtejavath"
            target="_blank"
            rel="noreferrer"
            className="developer-link"
          >
            <span className="developer-link__icon">
              <Code2 size={16} />
            </span>
            <span className="developer-link__copy">
              <strong>GitHub</strong>
              <small>View projects</small>
            </span>
            <ExternalLink size={15} />
          </a>

          <a
            href="https://www.linkedin.com/in/hemanth-tejavath/"
            target="_blank"
            rel="noreferrer"
            className="developer-link"
          >
            <span className="developer-link__icon">
              <Rocket size={16} />
            </span>
            <span className="developer-link__copy">
              <strong>LinkedIn</strong>
              <small>Connect with me</small>
            </span>
            <ExternalLink size={15} />
          </a>
        </div>
      </section>

      <div className="developer-grid">
        <article className="developer-card">
          <div className="developer-card__icon">
            <Lightbulb size={18} />
          </div>
          <h3>Why FindIt</h3>
          <p>
            Lost item reporting often lives in scattered chats and posters.
            FindIt brings that flow into one cleaner product space.
          </p>
        </article>

        <article className="developer-card">
          <div className="developer-card__icon">
            <Code2 size={18} />
          </div>
          <h3>Tech Stack</h3>
          <p>
            React for the frontend, Node.js and Express for the backend, MongoDB
            for data, and a focused UI system for consistency.
          </p>
        </article>

        <article className="developer-card">
          <div className="developer-card__icon">
            <Rocket size={18} />
          </div>
          <h3>Future Direction</h3>
          <p>
            Smarter filtering, richer user profiles, better verification, and a
            more trusted recovery workflow across campuses.
          </p>
        </article>

        <article className="developer-card developer-card--contact">
          <div className="developer-card__icon">
            <Mail size={18} />
          </div>
          <h3>Meet or mail me</h3>
          <p>
            Want to collaborate, share feedback, or talk about the project?
            Reach out directly.
          </p>

          <a
            href="mailto:tejavathhemanth41@gmail.com"
            className="developer-mail"
          >
            <Mail size={16} />
            <span>tejavathhemanth41@gmail.com</span>
          </a>
        </article>

        <article className="developer-card developer-card--story">
          <div className="developer-card__icon">
            <Lightbulb size={18} />
          </div>
          <h3>How I got this idea</h3>
          <p>
            I kept seeing many lost-and-found messages shared across campus
            groups, but there was no proper website where people could report,
            search, and reconnect in one clear place. In many cases, updates
            were also being managed through Excel sheets, which made the process
            slow, repetitive, and hard to follow.
          </p>
          <p>
            That is where the idea for FindIt came from: building a cleaner
            multi-campus recovery platform where lost and found reports can live
            in one searchable system instead of getting buried in chats,
            screenshots, forwards, or spreadsheets.
          </p>
        </article>
      </div>
    </div>
  );
}

export default DeveloperProfileContent;
