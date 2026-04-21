import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ItemCard from "../components/ItemCard";
import api from "../services/api";

function MyItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const token = localStorage.getItem("token");

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    const fetchMyItems = async () => {
      if (!token) {
        setItems([]);
        setError("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await api.get("/items/myItems");
        setItems(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Please sign in again to view your reported items.");
        } else {
          setError("Unable to load your items.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, [token]);

  const handleDeleteItem = async (item) => {
    const shouldDelete = window.confirm(
      `Delete "${item.title}"? This action cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(item._id);
      setError("");
      await api.delete(`/items/${item._id}`);
      setItems((prev) => prev.filter((currentItem) => currentItem._id !== item._id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete this item.");
    } finally {
      setDeletingId("");
    }
  };

  const handleEditItem = (item) => {
    navigate(`/report/${item._id}/edit`);
  };

  const totalReports = items.length;
  const activeReports = items.filter((item) => item.status !== "completed").length;
  const completedReports = items.filter((item) => item.status === "completed").length;
  const initial = (storedUser?.name || "U").slice(0, 1).toUpperCase();

  return (
    <div className="profile-layout">
      <Navbar />

      <section className="profile-page">
        <div className="profile-shell">
          <Link to="/" className="profile-back">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <div className="profile-card">
            <div className="profile-card__header">
              <div className="profile-avatar">{initial}</div>

              <div className="profile-copy">
                <div className="profile-copy__name">
                  <h1>{storedUser?.name || "User"}</h1>
                  <Pencil size={14} />
                </div>
                <p>{storedUser?.email || "No email available"}</p>
              </div>
            </div>

            <div className="profile-stats">
              <div className="profile-stat">
                <strong>{totalReports}</strong>
                <span>Total Reports</span>
              </div>
              <div className="profile-stat">
                <strong>{activeReports}</strong>
                <span>Active</span>
              </div>
              <div className="profile-stat">
                <strong>{completedReports}</strong>
                <span>Completed</span>
              </div>
            </div>
          </div>

          <div className="profile-items">
            <h2>My Reported Items</h2>

            {loading ? (
              <div className="profile-state">
                <p>Loading your items...</p>
              </div>
            ) : error ? (
              <div className="profile-state">
                <p>{error}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="profile-state">
                <p>No reported items yet. Your submitted items will appear here.</p>
              </div>
            ) : (
              <div className="profile-items__grid">
                {items.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    deleteDisabled={deletingId === item._id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MyItems;
