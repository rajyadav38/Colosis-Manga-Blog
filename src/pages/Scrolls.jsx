import React, { useEffect, useRef, useState } from "react";
import ScrollsSkeleton from "../components/skeletons/ScrollsSkeleton";
import "./scrolls.css";

export default function Scrolls() {
  const [reels, setReels] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [activeComments, setActiveComments] = useState(null);

  const videoRefs = useRef([]);

  const API_URL = process.env.REACT_APP_API_URL;
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // =========================================================
  // FETCH REELS
  // =========================================================

  const fetchReels = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/reels`);
      const data = await res.json();

      setReels(data);
    } catch (err) {
      console.log("Fetch reels error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // =========================================================
  // AUTOPLAY / PAUSE
  // =========================================================

  useEffect(() => {
    if (!reels.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.7,
      },
    );

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          observer.unobserve(video);
        }
      });
    };
  }, [reels]);

  // =========================================================
  // LIKE
  // =========================================================

  const handleLike = async (reelId) => {
    if (!currentUser?.id) return;

    try {
      const res = await fetch(`${API_URL}/api/reels/like/${reelId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userId: currentUser.id,
        }),
      });

      const data = await res.json();

      if (data.message === "Already liked") {
        alert("You already liked this reel");
      }

      fetchReels();
    } catch (error) {
      console.log("Like error:", error);
    }
  };

  // =========================================================
  // COMMENT
  // =========================================================

  const handleComment = async (reelId) => {
    if (!currentUser?.username) return;

    try {
      const text = commentInputs[reelId]?.trim();

      if (!text) return;

      const res = await fetch(`${API_URL}/api/reels/comment/${reelId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: currentUser.username,
          text,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to post comment");
      }

      // Clear input
      setCommentInputs((prev) => ({
        ...prev,
        [reelId]: "",
      }));

      // Refresh comments
      await fetchReels();
    } catch (error) {
      console.log("Comment error:", error);
    }
  };

  // =========================================================
  // SHARE
  // =========================================================

  const handleShare = async (url) => {
    try {
      await navigator.clipboard.writeText(url);

      alert("🔗 Reel link copied!");
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  // =========================================================
  // COMMENTS TOGGLE
  // =========================================================

  const toggleComments = (reelId) => {
    setActiveComments((prev) => {
      if (prev === reelId) {
        return null;
      }

      return reelId;
    });
  };

  const closeComments = () => {
    setActiveComments(null);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return <ScrollsSkeleton />;
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="scrolls-page">
      <div className="scrolls-feed">
        {reels.map((reel, index) => {
          const commentsOpen = activeComments === reel._id;

          return (
            <section className="scroll-item" key={reel._id}>
              {/* =================================================
                  BLURRED BACKGROUND
              ================================================= */}

              <video
                className="scroll-bg-video"
                src={reel.videoUrl}
                autoPlay
                muted
                loop
                playsInline
              />

              {/* =================================================
                  REEL
              ================================================= */}

              <div className="scroll-reel">
                {/* =================================================
                    VIDEO
                ================================================= */}

                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  className="scroll-video"
                  src={reel.videoUrl}
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                  controls={false}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                  onContextMenu={(e) => e.preventDefault()}
                />

                {/* =================================================
                    TOP BAR
                ================================================= */}

                <div className="scroll-topbar">
                  <span className="scrolls-brand">SCROLLS</span>

                  <button
                    className="scroll-sound-btn"
                    onClick={() => setMuted((prev) => !prev)}
                    aria-label={muted ? "Turn sound on" : "Mute"}
                  >
                    {muted ? "🔇" : "🔊"}
                  </button>
                </div>

                {/* =================================================
                    VIDEO GRADIENT
                ================================================= */}

                <div className="scroll-gradient" />

                {/* =================================================
                    CREATOR INFO
                ================================================= */}

                <div className="scroll-info">
                  <button className="scroll-username">@{reel.username}</button>

                  {reel.caption && (
                    <p className="scroll-caption">{reel.caption}</p>
                  )}
                </div>

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <div className="scroll-actions">
                  {/* LIKE */}

                  <button
                    className="scroll-action-btn"
                    onClick={() => handleLike(reel._id)}
                    aria-label="Like"
                  >
                    <span className="scroll-action-icon">❤️</span>

                    <span className="scroll-action-count">
                      {reel.likes || 0}
                    </span>
                  </button>

                  {/* COMMENTS */}

                  <button
                    className={`scroll-action-btn ${
                      commentsOpen ? "active" : ""
                    }`}
                    onClick={() => toggleComments(reel._id)}
                    aria-label="Comments"
                  >
                    <span className="scroll-action-icon">💬</span>

                    <span className="scroll-action-count">
                      {reel.comments?.length || 0}
                    </span>
                  </button>

                  {/* SHARE */}

                  <button
                    className="scroll-action-btn"
                    onClick={() => handleShare(reel.videoUrl)}
                    aria-label="Share"
                  >
                    <span className="scroll-action-icon">🔗</span>
                  </button>
                </div>

                {/* =================================================
                    COMMENTS PANEL
                ================================================= */}

                <div
                  className={`scroll-comments ${commentsOpen ? "open" : ""}`}
                >
                  {/* HEADER */}

                  <div className="scroll-comments-header">
                    <strong>Comments</strong>

                    <button
                      type="button"
                      onClick={closeComments}
                      aria-label="Close comments"
                    >
                      ✕
                    </button>
                  </div>

                  {/* COMMENTS LIST */}

                  <div className="scroll-comments-list">
                    {reel.comments?.length > 0 ? (
                      reel.comments.map((comment, i) => (
                        <div className="scroll-comment" key={i}>
                          <strong>@{comment.username}</strong>

                          <p>{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="scroll-no-comments">
                        No comments yet.
                        <br />
                        Be the first to comment.
                      </div>
                    )}
                  </div>

                  {/* =================================================
                      COMMENT INPUT
                  ================================================= */}

                  <div className="scroll-comment-input">
                    <input
                      type="text"
                      value={commentInputs[reel._id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [reel._id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleComment(reel._id);
                        }
                      }}
                      placeholder="Write a comment..."
                    />

                    <button
                      type="button"
                      onClick={() => handleComment(reel._id)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
