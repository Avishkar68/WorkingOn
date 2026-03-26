import { useEffect, useState } from "react";
import api from "../../api/axios";

const Opportunity = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const res = await api.get("/opportunities/scrape");
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load opportunities");
      } finally {
        setLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white p-6">
      
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">
        🔥 Latest Internships
      </h1>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-gray-800 animate-pulse"
            >
              <div className="h-4 bg-gray-700 mb-3 rounded"></div>
              <div className="h-3 bg-gray-700 mb-2 rounded"></div>
              <div className="h-3 bg-gray-700 mb-2 rounded"></div>
              <div className="h-8 bg-gray-700 mt-4 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400">{error}</p>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <p className="text-gray-400">
          No opportunities found 😢
        </p>
      )}

      {/* Data */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="group p-5 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/10"
          >
            {/* Title */}
            <h2 className="text-lg font-semibold group-hover:text-blue-400 transition">
              {item.title}
            </h2>

            {/* Company */}
            <p className="text-sm text-gray-400 mt-1">
              {item.company || "Unknown Company"}
            </p>

            {/* Info */}
            <div className="mt-3 space-y-1 text-sm">
              <p>💰 {item.stipend || "Not disclosed"}</p>
              <p>⏳ {item.duration || "Flexible"}</p>
            </div>

            {/* Button */}
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg font-medium"
            >
              Apply Now →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opportunity;