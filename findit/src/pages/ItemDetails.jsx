import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  Smartphone,
  Tag,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

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

function getWhatsAppLink(phoneNumber, title) {
  if (!phoneNumber) return "";

  const cleanNumber = String(phoneNumber).replace(/\D/g, "");
  if (!cleanNumber) return "";

  const message = encodeURIComponent(
    `Hi, I'm contacting you from FindIt about the item: ${title}.`,
  );

  return `https://wa.me/91${cleanNumber}?text=${message}`;
}

function getNormalizedId(value) {
  if (!value) return "";

  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return String(value._id);
  if (typeof value === "object" && value.id) return String(value.id);

  return String(value);
}

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completionConfirmed, setCompletionConfirmed] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  let storedUser = {};
  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    storedUser = {};
  }

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/items/${id}`);
        setItem(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const categoryTone = item?.category === "lost" ? "is-lost" : "is-found";
  const whatsappLink = item ? getWhatsAppLink(item.whatsapp, item.title) : "";
  const currentUserId = getNormalizedId(storedUser?._id || storedUser?.id);
  const itemOwnerId = getNormalizedId(item?.userId);
  const isOwner = Boolean(item && currentUserId && itemOwnerId === currentUserId);
  const canMarkCompleted = Boolean(isOwner && item?.status !== "completed");

  const handleMarkCompleted = async () => {
    if (!item?._id || !completionConfirmed || updatingStatus) return;

    try {
      setUpdatingStatus(true);
      setStatusError("");
      setStatusSuccess("");

      const response = await api.patch(`/items/${item._id}/status`, {
        status: "completed",
      });

      setItem(response.data.item);
      setStatusSuccess("Item marked as completed successfully.");
      setCompletionConfirmed(false);
    } catch (err) {
      setStatusError(
        err.response?.data?.message || "Unable to update item status.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="details-layout">
      <Navbar />

      <section className="details-page">
        <div className="details-shell">
          <Link to="/" className="details-back">
            <ArrowLeft size={18} />
            <span>Back to items</span>
          </Link>

          {loading ? (
            <div className="details-state">
              <h2>Loading item details...</h2>
              <p>Please wait while we fetch the complete listing.</p>
            </div>
          ) : error ? (
            <div className="details-state">
              <h2>Something went wrong</h2>
              <p>{error}</p>
            </div>
          ) : (
            <div className="details-card">
              <div className="details-media">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="details-image" />
                ) : (
                  <div className="details-placeholder">
                    <Tag size={30} />
                    <span>No image available</span>
                  </div>
                )}

                <div className="details-badges">
                  <span className={`details-badge ${categoryTone}`}>
                    {item.category === "lost" ? "Lost" : "Found"}
                  </span>
                  {item.status === "completed" && (
                    <span className="details-badge details-badge--status">
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="details-content">
                <div className="details-header">
                  <h1>{item.title}</h1>
                  <p>{item.description}</p>
                </div>

                <div className="details-grid">
                  <div className="details-info">
                    <MapPin size={18} />
                    <div>
                      <span>Local Area</span>
                      <strong>{item.location}</strong>
                    </div>
                  </div>

                  <div className="details-info">
                    <MapPin size={18} />
                    <div>
                      <span>Region / Campus</span>
                      <strong>{item.region || "Not available"}</strong>
                    </div>
                  </div>

                  <div className="details-info">
                    <CalendarDays size={18} />
                    <div>
                      <span>Date</span>
                      <strong>{formatDate(item.date)}</strong>
                    </div>
                  </div>

                  <div className="details-info">
                    <Smartphone size={18} />
                    <div>
                      <span>Contact</span>
                      <strong>{item.whatsapp || item.phone || "Not available"}</strong>
                    </div>
                  </div>

                  {item.status === "completed" && (
                    <div className="details-info">
                      <CheckCircle2 size={18} />
                      <div>
                        <span>Status</span>
                        <strong>Completed</strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="details-extra">
                  {item.proofRequired && (
                    <span className="details-chip">
                      <ShieldCheck size={15} />
                      Proof required for handover
                    </span>
                  )}

                  {item.uniqueIdentifier && (
                    <span className="details-chip">
                      <Tag size={15} />
                      ID detail: {item.uniqueIdentifier}
                    </span>
                  )}
                </div>

                {whatsappLink && (
                  <div className="details-actions">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="details-whatsapp"
                    >
                      <Smartphone size={18} />
                      <span>Contact on WhatsApp</span>
                    </a>
                  </div>
                )}

                {canMarkCompleted && (
                  <div className="details-completion">
                    <div className="details-completion__header">
                      <AlertTriangle size={18} />
                      <div>
                        <h3>Complete only after safe handover</h3>
                        <p>
                          Mark this item completed only after the item is
                          actually handed over to the correct person.
                        </p>
                      </div>
                    </div>

                    <div className="details-completion__checks">
                      <p>Before marking completed, make sure you have:</p>
                      <ul>
                        <li>verified the person&apos;s claim or identity</li>
                        <li>confirmed the handover really happened</li>
                        <li>checked important item details one last time</li>
                      </ul>
                    </div>

                    <label className="details-completion__confirm">
                      <input
                        type="checkbox"
                        checked={completionConfirmed}
                        onChange={(event) =>
                          setCompletionConfirmed(event.target.checked)
                        }
                      />
                      <span>
                        I confirm the item has been safely handed over to the
                        right person.
                      </span>
                    </label>

                    {(statusError || statusSuccess) && (
                      <div
                        className={`details-completion__message ${
                          statusSuccess
                            ? "is-success"
                            : "is-error"
                        }`}
                      >
                        {statusSuccess || statusError}
                      </div>
                    )}

                    <button
                      type="button"
                      className="details-completion__button"
                      onClick={handleMarkCompleted}
                      disabled={!completionConfirmed || updatingStatus}
                    >
                      {updatingStatus ? (
                        <>
                          <LoaderCircle size={16} className="details-spinner" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <span>Mark as Completed</span>
                      )}
                    </button>
                  </div>
                )}

                {item.verificationNote && (
                  <div className="details-panel">
                    <h3>Verification note</h3>
                    <p>{item.verificationNote}</p>
                  </div>
                )}

                {item.handoverInstructions && (
                  <div className="details-panel">
                    <h3>Handover instructions</h3>
                    <p>{item.handoverInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ItemDetails;
