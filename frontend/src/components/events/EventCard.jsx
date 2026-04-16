import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { buttonTap, cardHover, fadeInUp } from "../../lib/motion";
import { CalendarDays, MapPin, Users, Share2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import ConfirmationModal from "../common/ConfirmationModal";
import { useState } from "react";

export default function EventCard({ event, refresh }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = localStorage.getItem("token");
  let currentUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.id || decoded._id;
    } catch {
      currentUserId = null;
    }
  }

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const register = () => {
    if (event.registrationLink) window.open(event.registrationLink, "_blank");
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/events/${event._id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/events/${event._id}`);
      toast.success("Event deleted!");
      if (refresh) refresh();
      setShowDeleteConfirm(false);
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  const handleCardClick = () => {
    if (showDeleteConfirm) return;
    if (event.registrationLink) {
      window.open(event.registrationLink, "_blank");
    }
  };

  return (
    <motion.div
      className="glass-card overflow-hidden cursor-pointer"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={cardHover}
      onClick={handleCardClick}
    >
      {event.image ? (
        <img
          src={event.image}
          alt="event"
          className="w-full h-40 md:h-48 object-cover"
        />
      ) : (
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978"
          alt="fallback"
          className="w-full h-40 md:h-48 object-cover"
        />
      )}

      <div className="p-4 md:p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">{event.title}</h2>
        <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-3 md:line-clamp-none">
          {event.description}
        </p>

        <div className="flex gap-2 flex-wrap">
          {event.tags
            ?.flatMap((t) => t.split(","))
            .map((t) => t.trim())
            .filter(Boolean)
            .map((tag) => (
              <span key={tag} className="pill-badge text-[10px] md:text-xs">
                #{tag}
              </span>
            ))}
        </div>

        <div className="text-gray-400 text-sm space-y-1">
          <p className="flex items-center gap-2">
            <CalendarDays size={14} className="text-[#2DD4BF]" />{" "}
            {formatDate(event.date)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={14} className="text-rose-400" /> {event.location}
          </p>
        </div>

        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row gap-3">
          <motion.button
            onClick={register}
            whileHover={{ scale: 1.02 }}
            whileTap={buttonTap}
            className="flex-1 btn-primary font-semibold text-sm py-3 rounded-xl"
          >
            Register Interest
          </motion.button>

          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={handleShare}
              whileTap={buttonTap}
              className="p-3 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white flex-1 sm:flex-none flex justify-center"
            >
              <Share2 size={18} />
            </motion.button>

            {(event.organizer?._id || event.organizer)?.toString() ===
              currentUserId?.toString() && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                whileTap={buttonTap}
                className="p-3 rounded-xl border border-white/10 bg-white/5 text-red-400 hover:text-red-500 flex-1 sm:flex-none flex justify-center"
              >
                <Trash2 size={18} />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        confirmText="Confirm Delete"
      />
    </motion.div>
  );
}
