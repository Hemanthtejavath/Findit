import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import REGIONS from "../lib/region";
import api from "../services/api";

function formatDateForInput(dateValue) {
  if (!dateValue) return "";

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toISOString().slice(0, 10);
}

function CreateItem() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const phoneRegex = /^[0-9]{10}$/;
  const [form, setForm] = useState({
    category: "lost",
    date: "",
    title: "",
    description: "",
    region: "",
    location: "",
    phone: "",
    whatsapp: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingItem, setLoadingItem] = useState(isEditMode);

  const pageCopy = useMemo(
    () =>
      isEditMode
        ? {
            title: "Edit Item",
            subtitle: "Update your report details and keep the listing accurate",
            submit: "Save Changes",
          }
        : {
            title: "Report an Item",
            subtitle: "Fill in the details to report a lost or found item",
            submit: "Report Item",
          },
    [isEditMode],
  );

  useEffect(() => {
    if (!isEditMode) {
      setLoadingItem(false);
      return;
    }

    const fetchItem = async () => {
      try {
        setLoadingItem(true);
        setError("");

        const response = await api.get(`/items/${id}`);
        const item = response.data;

        setForm({
          category: item.category || "lost",
          date: formatDateForInput(item.date),
          title: item.title || "",
          description: item.description || "",
          region: item.region || "",
          location: item.location || "",
          phone: item.phone || "",
          whatsapp: item.whatsapp || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load item details.");
      } finally {
        setLoadingItem(false);
      }
    };

    fetchItem();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue =
      name === "phone" || name === "whatsapp"
        ? value.replace(/\D/g, "").slice(0, 10)
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files?.[0] || null);
  };

  const validate = () => {
    const requiredFields = [
      ["title", "Title"],
      ["description", "Description"],
      ["category", "Category"],
      ["location", "Local area"],
      ["date", "Date"],
      ["phone", "Phone"],
      ["region", "Region / Campus"],
      ["whatsapp", "WhatsApp"],
    ];

    const missingField = requiredFields.find(([key]) => {
      const value = String(form[key] ?? "").trim();
      return value === "";
    });
    if (missingField) {
      return `${missingField[1]} is required.`;
    }

    if (!phoneRegex.test(form.phone)) {
      return "Phone number must be exactly 10 digits.";
    }

    if (!phoneRegex.test(form.whatsapp)) {
      return "WhatsApp number must be exactly 10 digits.";
    }

    if (Number.isNaN(new Date(form.date).getTime())) {
      return "Please select a valid date.";
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

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        const sanitizedValue =
          key === "phone" || key === "whatsapp"
            ? String(value).replace(/\D/g, "")
            : value;

        formData.append(key, sanitizedValue);
      });

      if (image) {
        formData.append("image", image);
      }

      if (isEditMode) {
        await api.patch(`/items/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/items", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate(isEditMode ? "/profile" : "/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isEditMode ? "Failed to update item." : "Failed to report item."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-layout">
      <Navbar />

      <section className="report-page">
        <div className="report-shell">
          <Link to="/" className="report-back">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>

          <div className="report-card">
            <div className="report-card__header">
              <h1>{pageCopy.title}</h1>
              <p>{pageCopy.subtitle}</p>
            </div>

            {error && <div className="report-error">{error}</div>}

            {loadingItem ? (
              <div className="report-loading">
                <p>Loading item details...</p>
              </div>
            ) : (
              <form className="report-form" onSubmit={handleSubmit}>
                <div className="report-grid report-grid--two">
                  <label className="report-field">
                    <span>Category</span>
                    <select
                      className="report-select report-select--category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option value="lost">Lost</option>
                      <option value="found">Found</option>
                    </select>
                  </label>

                  <label className="report-field">
                    <span>Date</span>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <label className="report-field">
                  <span>Title</span>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Black leather wallet"
                    value={form.title}
                    onChange={handleChange}
                  />
                </label>

                <label className="report-field">
                  <span>Description</span>
                  <textarea
                    name="description"
                    placeholder="Describe the item..."
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </label>

                <label className="report-field">
                  <span>Region / Campus</span>
                  <select
                    className="report-select report-select--region"
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                  >
                    <option value="">Select region</option>
                    {REGIONS.map((regionOption) => (
                      <option key={regionOption.value} value={regionOption.value}>
                        {regionOption.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="report-field">
                  <span>Local Area</span>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g., Hostel Block C, Library, Canteen"
                    value={form.location}
                    onChange={handleChange}
                  />
                </label>

                <div className="report-grid report-grid--two">
                  <label className="report-field">
                    <span>Phone</span>
                    <input
                      type="text"
                      name="phone"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit number"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="report-field">
                    <span>WhatsApp</span>
                    <input
                      type="text"
                      name="whatsapp"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit number"
                      value={form.whatsapp}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <label className="report-field">
                  <span>Image</span>
                  <label className="report-upload">
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <Upload size={18} />
                    <span>
                      {image
                        ? image.name
                        : isEditMode
                          ? "Upload a new image only if you want to replace the old one"
                          : "Click to upload image"}
                    </span>
                  </label>
                </label>

                <button type="submit" className="report-submit" disabled={loading}>
                  {loading ? "Submitting..." : pageCopy.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CreateItem;
