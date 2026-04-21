import { ArrowRight, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

function DeveloperSpotlight({
  className = "",
  eyebrow = "Meet the developer",
  title = "See the creator profile behind FindIt",
  description = "Explore the story, stack, and contact details behind FindIt.",
  actionLabel = "View profile",
  to = "/developer",
  onActivate,
}) {
  const classes = ["developer-spotlight", className].filter(Boolean).join(" ");
  const content = (
    <div className="developer-spotlight__inner">
      <div className="developer-spotlight__glow developer-spotlight__glow--left" />
      <div className="developer-spotlight__glow developer-spotlight__glow--right" />

      <div className="developer-spotlight__icon">
        <Code2 size={18} />
      </div>

      <div className="developer-spotlight__copy">
        <span>{eyebrow}</span>
        <strong>{title}</strong>
        <small>{description}</small>
      </div>

      <div className="developer-spotlight__action">
        <span>{actionLabel}</span>
        <ArrowRight size={18} />
      </div>
    </div>
  );

  if (onActivate) {
    return (
      <button type="button" className={classes} onClick={onActivate}>
        {content}
      </button>
    );
  }

  return (
    <Link to={to} className={classes}>
      {content}
    </Link>
  );
}

export default DeveloperSpotlight;
