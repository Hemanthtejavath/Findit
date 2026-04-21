import {
  CalendarDays,
  MapPin,
  Pencil,
  Tag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

function formatDate(dateValue) {
  if (!dateValue) return "Date not available";

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return "Date not available";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ItemCard({
  item,
  onDelete,
  deleteDisabled = false,
  onEdit,
  editDisabled = false,
}) {
  const {
    title,
    description,
    imageUrl,
    category,
    location,
    region,
    date,
    status,
  } = item;

  const cardTone = category === "lost" ? "is-lost" : "is-found";
  const showCompletedBadge = status === "completed";

  return (
    <article className={`item-card ${cardTone}`}>
      <Link to={`/items/${item._id}`} className="item-card-link">
        <div className="item-card__media">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="item-card__image" />
          ) : (
            <div className="item-card__placeholder">
              <Tag size={26} />
              <span>{category === "lost" ? "Lost Item" : "Found Item"}</span>
            </div>
          )}

          <div className="item-card__badges">
            <span className={`item-card__badge ${cardTone}`}>
              {category === "lost" ? "Lost" : "Found"}
            </span>
            {showCompletedBadge && (
              <span className="item-card__badge item-card__badge--status is-completed">
                Completed
              </span>
            )}
          </div>
        </div>

        <div className="item-card__content">
          <div className="item-card__header">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>

          <div className="item-card__footer">
            <div className="item-card__meta-item">
              <MapPin size={16} />
              <span>
                {location}
                {region ? `, ${region}` : ""}
              </span>
            </div>

            <div className="item-card__meta-item">
              <CalendarDays size={16} />
              <span>{formatDate(date)}</span>
            </div>
          </div>
        </div>
      </Link>

      {(onEdit || onDelete) && (
        <div className="item-card__actions">
          {onEdit && (
            <button
              type="button"
              className="item-card__edit"
              onClick={() => onEdit(item)}
              disabled={editDisabled}
            >
              <Pencil size={15} />
              <span>Edit Report</span>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="item-card__delete"
              onClick={() => onDelete(item)}
              disabled={deleteDisabled}
            >
              <Trash2 size={15} />
              <span>{deleteDisabled ? "Deleting..." : "Delete Report"}</span>
            </button>
          )}
        </div>
      )}
    </article>
  );
}

export default ItemCard;
