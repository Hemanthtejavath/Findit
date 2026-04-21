import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin, Search } from "lucide-react";
import { CgSearchFound } from "react-icons/cg";
import { RiFileCloseLine } from "react-icons/ri";
import { MdOutlineFoundation } from "react-icons/md";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { Link } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import Navbar from "../components/Navbar";
import REGIONS from "../lib/region.js";
import api from "../services/api.js";

const REGION_ALIASES = {
  "iit-patna": ["iit-patna", "iitpatna", "iitp", "iit patna"],
  "iit-delhi": ["iit-delhi", "iitdelhi", "iitd", "iit delhi"],
  "iit-bombay": ["iit-bombay", "iitbombay", "iitb", "iit bombay"],
  "iit-guwahati": ["iit-guwahati", "iitguwahati", "iitg", "iit guwahati"],
  "nit-patna": ["nit-patna", "nitpatna", "nit patna"],
  "nit-trichy": ["nit-trichy", "nittrichy", "nitt", "nit trichy"],
};

function normalizeRegionValue(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const regionRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await api.get("/items");
        setItems(response.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const emptyCopy = {
    all: {
      title: "No items found",
      text: "Try adjusting your search or filters",
    },
    lost: {
      title: "No lost items found",
      text: "Try adjusting your search or filters",
    },
    found: {
      title: "No found items yet",
      text: "New found item reports will appear here",
    },
    done: {
      title: "No completed recoveries yet",
      text: "Recovered handovers will appear here once items are resolved",
    },
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setIsRegionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const regionOptions = [{ value: "all", label: "All Regions" }, ...REGIONS];
  const selectedRegion =
    regionOptions.find((regionOption) => regionOption.value === region) ||
    regionOptions[0];

  const doesRegionMatch = (
    itemRegion,
    selectedRegionValue,
    selectedRegionLabel,
  ) => {
    if (selectedRegionValue === "all") return true;

    const normalizedItemRegion = normalizeRegionValue(itemRegion);
    const directCandidates = [
      selectedRegionValue,
      selectedRegionLabel,
      ...(REGION_ALIASES[selectedRegionValue] || []),
    ].map(normalizeRegionValue);

    return directCandidates.includes(normalizedItemRegion);
  };

  const filteredItems = items.filter((item) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "lost" &&
        item.category === "lost" &&
        item.status !== "completed") ||
      (activeTab === "found" &&
        item.category === "found" &&
        item.status !== "completed") ||
      (activeTab === "done" && item.status === "completed");

    const matchesRegion = doesRegionMatch(
      item.region,
      region,
      selectedRegion.label,
    );

    const matchesSearch =
      search.trim() === "" ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesRegion && matchesSearch;
  });

  return (
    <div className="home-layout">
      <Navbar />

      <section className="home-page">
        <div className="home-hero">
          <h1>
            Lost something? <span>Find it here.</span>
          </h1>

          <p>
            Report lost items, browse found items, and reconnect with your
            belongings across campuses.
          </p>

          <div className="home-filters">
            <label className="home-search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <div className="home-region-dropdown" ref={regionRef}>
              <button
                type="button"
                className={`home-region ${isRegionOpen ? "is-open" : ""}`}
                onClick={() => setIsRegionOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isRegionOpen}
              >
                <MapPin size={18} />
                <span>{selectedRegion.label}</span>
                <ChevronDown size={18} />
              </button>

              {isRegionOpen && (
                <div className="home-region-menu" role="listbox">
                  {regionOptions.map((regionOption) => (
                    <button
                      key={regionOption.value}
                      type="button"
                      role="option"
                      className={`home-region-option ${
                        region === regionOption.value ? "is-selected" : ""
                      }`}
                      onClick={() => {
                        setRegion(regionOption.value);
                        setIsRegionOpen(false);
                      }}
                    >
                      {regionOption.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="home-tabs"
          role="tablist"
          aria-label="Item status filters"
        >
          <div className="twoButtons">
            <button
              type="button"
              className={`home-tab ${activeTab === "all" ? "is-active is-all" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <CgSearchFound size={35} />

              <span>All</span>
            </button>

            <button
              type="button"
              className={`home-tab ${activeTab === "lost" ? "is-active is-lost" : ""}`}
              onClick={() => setActiveTab("lost")}
            >
              <RiFileCloseLine size={30} />
              <span>Lost</span>
            </button>
          </div>

          <div className="twoButtons">
            <button
              type="button"
              className={`home-tab ${activeTab === "found" ? "is-active is-found" : ""}`}
              onClick={() => setActiveTab("found")}
            >
              <MdOutlineFoundation size={35} />

              <span>Found</span>
            </button>

            <button
              type="button"
              className={`home-tab ${activeTab === "done" ? "is-active is-done" : ""}`}
              onClick={() => setActiveTab("done")}
            >
              <MdOutlineFileDownloadDone size={35} />
              <span>Done</span>
            </button>
          </div>
        </div>

        {loading || error || filteredItems.length === 0 ? (
          <div className="home-empty">
            <div className="home-empty__icon">
              <Search size={42} strokeWidth={1.8} />
            </div>
            <h2>
              {loading
                ? "Loading items..."
                : error
                  ? "Unable to load items"
                  : emptyCopy[activeTab].title}
            </h2>
            <p>
              {loading
                ? "Please wait while we fetch the latest listings"
                : error || emptyCopy[activeTab].text}
            </p>
            {!loading && !error && activeTab === "done" && (
              <p className="home-results__note">
                Completed items are automatically removed one month after
                handover.
              </p>
            )}
          </div>
        ) : (
          <section className="home-results">
            <div className="home-results__header">
              <div>
                <span className="home-results__eyebrow">Live listings</span>
                <h2>{filteredItems.length} items ready to explore</h2>
              </div>
              <p>
                Browse the latest lost and found reports across your selected
                filters.
              </p>
            </div>

            <div className="home-results__grid">
              {filteredItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>

            {activeTab === "done" && (
              <p className="home-results__note">
                Completed items are automatically removed one month after
                handover.
              </p>
            )}
          </section>
        )}
      </section>

      <footer className="home-footer">
        <p>Built for smarter campus recovery.</p>
        <Link to="/developer-profile" className="home-footer__link">
          Developer Profile
        </Link>
      </footer>
    </div>
  );
}

export default Home;
