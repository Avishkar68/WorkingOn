import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useSocket } from "../context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageCircle,
  Sparkles,
  Clock,
  User,
  Plus,
  ArrowLeft,
  Hash,
} from "lucide-react";

export default function AcademicHelp() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [activePost, setActivePost] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const repliesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/academic");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Socket.IO real-time listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewPost = (newPost) => {
      setPosts((prev) => {
        if (prev.some((p) => p._id === newPost._id)) return prev;
        return [newPost, ...prev];
      });
    };

    const handleNewReply = ({ postId, reply }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
              ...p,
              replies: [
                ...(p.replies || []).filter((r) => r._id !== reply._id),
                reply,
              ],
            }
            : p
        )
      );
    };

    const handleDeletePost = ({ postId }) => {
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setActivePost((current) => (current === postId ? null : current));
    };

    socket.on("academic:new-post", handleNewPost);
    socket.on("academic:new-reply", handleNewReply);
    socket.on("academic:delete-post", handleDeletePost);

    return () => {
      socket.off("academic:new-post", handleNewPost);
      socket.off("academic:new-reply", handleNewReply);
      socket.off("academic:delete-post", handleDeletePost);
    };
  }, [socket]);

  // Auto-scroll when new replies arrive for the active post
  useEffect(() => {
    if (repliesEndRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        120;
      if (isNearBottom) {
        repliesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [posts, activePost]);

  const create = async () => {
    // 1. Validation check to prevent empty submissions
    if (!title.trim() || !desc.trim()) return;

    setIsCreating(true);
    try {
      // 2. Perform the API request
      const res = await api.post("/academic", { title, description: desc });

      // 3. Clear the input fields
      setTitle("");
      setDesc("");
      setShowComposer(false);

      /**
       * 4. CRITICAL FIX FOR MOBILE:
       * Manually update the posts state with the new data from the server.
       * This ensures that when we call 'setActivePost' in the next line,
       * 'activePostData' will NOT be null, preventing the blank screen on mobile.
       */
      setPosts((prev) => {
        // Prevent duplicate if socket already added it
        if (prev.some((p) => p._id === res.data._id)) return prev;
        return [res.data, ...prev];
      });

      // 5. Switch the view to the newly created post
      setActivePost(res.data._id);

      toast.success("Discussion started!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create discussion");
    } finally {
      setIsCreating(false);
    }
  };

  const reply = async (id, text) => {
    try {
      await api.post(`/academic/${id}/reply`, { text });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  };

  const activePostData = posts.find((p) => p._id === activePost);

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className={`ah-root ${activePost ? "ah-root--has-active" : ""}`}>
      {/* ─── THREADS SIDEBAR (30%) ─── */}
      <div className="ah-sidebar">
        {/* Header */}
        <div className="ah-sidebar-header">
          <div className="ah-sidebar-header-top">
            <div className="ah-sidebar-brand">
              <Hash size={16} className="ah-sidebar-brand-icon" />
              <span>Discussions</span>
            </div>
            <div className="ah-live-pill">
              <span className="ah-live-dot" />
              Live
            </div>
          </div>
          <button
            className="ah-new-btn"
            onClick={() => setShowComposer(!showComposer)}
          >
            <Plus size={14} />
            New Question
          </button>
        </div>

        {/* New question composer */}
        <AnimatePresence>
          {showComposer && (
            <motion.div
              className="ah-composer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="ah-composer-inner">
                <input
                  placeholder="Question title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="ah-composer-input"
                  autoFocus
                />
                <textarea
                  placeholder="Describe your doubt..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="ah-composer-textarea"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      create();
                    }
                  }}
                />
                <div className="ah-composer-actions">
                  <span className="ah-composer-hint">⌘+Enter to post</span>
                  <button
                    onClick={create}
                    disabled={isCreating || !title.trim() || !desc.trim()}
                    className="ah-composer-submit"
                  >
                    {isCreating ? (
                      <span className="ah-spinner" />
                    ) : (
                      <>
                        <Send size={13} />
                        Post
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thread list */}
        <div className="ah-thread-list">
          {loading ? (
            <div className="ah-thread-skeleton">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="ah-skeleton-item">
                  <div className="ah-skeleton-line ah-skeleton-line--w60" />
                  <div className="ah-skeleton-line ah-skeleton-line--w90" />
                  <div className="ah-skeleton-line ah-skeleton-line--w40" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="ah-empty-state">
              <MessageCircle size={28} strokeWidth={1.5} />
              <p>No discussions yet</p>
              <span>Start one above!</span>
            </div>
          ) : (
            posts.map((p) => (
              <button
                key={p._id}
                type="button"
                onClick={() => setActivePost(p._id)}
                className={`ah-thread-item${activePost === p._id ? " ah-thread-item--active" : ""}`}
              >
                <div className="ah-thread-row">
                  <h3 className="ah-thread-title">{p.title}</h3>
                  {(p.replies?.length || 0) > 0 && (
                    <span className="ah-thread-count">
                      {p.replies.length}
                    </span>
                  )}
                </div>
                <p className="ah-thread-preview">{p.description}</p>
                <div className="ah-thread-foot">
                  <span className="ah-thread-author">
                    {p.author?.name || "Anonymous"}
                  </span>
                  <span className="ah-thread-time">
                    {formatTime(p.createdAt)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ─── CHAT PANEL (70%) ─── */}
      <div className="ah-chat pt-20 md:pt-0">
        {!activePostData ? (
          <div className="ah-chat-placeholder">
            <div className="ah-chat-placeholder-inner">
              <Sparkles
                size={36}
                strokeWidth={1.5}
                className="ah-placeholder-icon"
              />
              <h2>Academic Help</h2>
              <p>Select a discussion from the sidebar to chat in real-time</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="ah-chat-header">
              <button
                className="ah-back-btn"
                onClick={() => setActivePost(null)}
              >
                <ArrowLeft size={16} />
              </button>
              <div className="ah-chat-header-text">
                <h2 className="ah-chat-header-title">
                  {activePostData.title}
                </h2>
                <span className="ah-chat-header-meta">
                  <Link to={`/user/${activePostData.author?._id}`} className="hover:text-indigo-400 transition-colors">
                    {activePostData.author?.name}
                  </Link> · {formatTime(activePostData.createdAt)} · {(activePostData.replies || []).length} replies
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="ah-messages" ref={messagesContainerRef}>
              {/* Original question */}
              <div className="ah-msg ah-msg--op">
                <Avatar user={activePostData.author} />
                <div className="ah-msg-body">
                  <div className="ah-msg-meta">
                    <Link to={`/user/${activePostData.author?._id}`} className="ah-msg-name hover:text-indigo-400 transition-colors">
                      {activePostData.author?.name || "Anonymous"}
                    </Link>
                    <span className="ah-msg-time">
                      {formatTime(activePostData.createdAt)}
                    </span>
                    <span className="ah-op-badge">OP</span>
                  </div>
                  <div className="ah-msg-bubble ah-msg-bubble--op">
                    <strong className="ah-msg-q-title">
                      {activePostData.title}
                    </strong>
                    {activePostData.description}
                  </div>
                </div>
              </div>

              {/* Divider if replies exist */}
              {(activePostData.replies || []).length > 0 && (
                <div className="ah-divider">
                  <span>
                    {activePostData.replies.length} {activePostData.replies.length === 1 ? "reply" : "replies"}
                  </span>
                </div>
              )}

              {/* Replies */}
              <AnimatePresence initial={false}>
                {(activePostData.replies || []).map((r, i) => (
                  <motion.div
                    key={r._id || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12 }}
                    className="ah-msg"
                  >
                    <Avatar user={r.user} />
                    <div className="ah-msg-body">
                      <div className="ah-msg-meta">
                        <Link to={`/user/${r.user?._id}`} className="ah-msg-name hover:text-indigo-400 transition-colors">
                          {r.user?.name || "Anonymous"}
                        </Link>
                        <span className="ah-msg-time">
                          {formatTime(r.createdAt)}
                        </span>
                      </div>
                      <div className="ah-msg-bubble">{r.text}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div ref={repliesEndRef} />
            </div>

            {/* Reply bar */}
            <ReplyBox onReply={(text) => reply(activePostData._id, text)} />
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Avatar helper ─── */
function Avatar({ user }) {
  const content = user?.profileImage ? (
    <img
      src={user.profileImage}
      alt=""
      className="ah-avatar-img"
    />
  ) : (
    <div className="ah-avatar-fallback">
      {user?.name?.[0]?.toUpperCase() || "?"}
    </div>
  );

  return (
    <Link to={`/user/${user?._id || user}`} className="ah-avatar-link hover:opacity-80 transition">
      {content}
    </Link>
  );
}

/* ─── Reply input ─── */
function ReplyBox({ onReply }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    const msg = text;
    setText("");
    setSending(true);
    await onReply(msg);
    setSending(false);
    inputRef.current?.focus();
  };

  return (
    <div className="ah-reply-bar">
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a reply..."
        className="ah-reply-input"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={sending}
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || sending}
        className="ah-reply-send"
      >
        {sending ? <span className="ah-spinner" /> : <Send size={15} />}
      </button>
    </div>
  );
}
