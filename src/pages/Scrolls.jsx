import React, { useEffect, useRef, useState } from "react";
import ScrollsSkeleton from "../components/skeletons/ScrollsSkeleton";
export default function Scrolls() {
  const [reels, setReels] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const videoRefs = useRef([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(true);
  // FETCH REELS
  const fetchReels = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/reels`);

      const data = await res.json();

      setReels(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // AUTOPLAY CURRENT VIDEO
  useEffect(() => {
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
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [reels]);

  // LIKE REEL
  const handleLike = async (reelId) => {
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
      console.log(error);
    }
  };

  // COMMENT
  const handleComment = async (reelId) => {
    try {
      const text = commentInputs[reelId];

      if (!text) return;

      await fetch(`${API_URL}/api/reels/comment/${reelId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: currentUser.username,
          text,
        }),
      });

      setCommentInputs({
        ...commentInputs,
        [reelId]: "",
      });

      fetchReels();
    } catch (error) {
      console.log(error);
    }
  };

  // SHARE
  const handleShare = (url) => {
    navigator.clipboard.writeText(url);

    alert("🔗 Reel link copied!");
  };
  if (loading) {
    return <ScrollsSkeleton />;
  }

  return (
    <div
      style={{
        background: "linear-gradient(to right, #050816, #0b1026, #050816)",
        minHeight: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {reels.map((reel, index) => (
        <div
          key={reel._id}
          style={{
            height: "100vh",
            width: "100%",
            position: "relative",
            overflow: "hidden",
            scrollSnapAlign: "start",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* BLURRED BACKGROUND */}
          <video
            src={reel.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(80px)",
              transform: "scale(1.2)",
              opacity: 0.25,
            }}
          />

          {/* MAIN REEL */}
          <div
            style={{
              width: "420px",
              height: "88vh",
              borderRadius: "28px",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 0 45px rgba(255,0,120,0.45)",
              zIndex: 2,
              background: "#000",
            }}
          >
            {/* VIDEO */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={reel.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              onContextMenu={(e) => e.preventDefault()}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
            />

            {/* OVERLAY */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "24px",
                background: "linear-gradient(transparent, rgba(0,0,0,0.95))",
                color: "white",
                zIndex: 5,
              }}
            >
              <h1
                style={{
                  fontWeight: "900",
                  fontSize: "2.2rem",
                  marginBottom: "10px",
                }}
              >
                @{reel.username}
              </h1>

              <p
                style={{
                  fontSize: "1rem",
                  color: "#ddd",
                  marginBottom: 0,
                }}
              >
                {reel.caption}
              </p>
            </div>
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div
            style={{
              position: "absolute",
              right: "40px",
              bottom: "120px",
              display: "flex",
              flexDirection: "column",
              gap: "22px",
              zIndex: 10,
            }}
          >
            {/* LIKE */}
            <button
              onClick={() => handleLike(reel._id)}
              style={{
                width: "78px",
                height: "78px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(14px)",
                color: "white",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ❤️
              <div>{reel.likes || 0}</div>
            </button>

            {/* COMMENT */}
            <button
              style={{
                width: "78px",
                height: "78px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(14px)",
                color: "white",
                fontSize: "1.2rem",
              }}
            >
              💬
              <div>{reel.comments?.length || 0}</div>
            </button>

            {/* SHARE */}
            <button
              onClick={() => handleShare(reel.videoUrl)}
              style={{
                width: "78px",
                height: "78px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(14px)",
                color: "white",
                fontSize: "1.3rem",
                cursor: "pointer",
              }}
            >
              🔗
            </button>
          </div>

          {/* COMMENT SECTION */}
          <div
            style={{
              position: "absolute",
              right: "140px",
              bottom: "40px",
              width: "340px",
              zIndex: 10,
            }}
          >
            {/* INPUT */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              <input
                value={commentInputs[reel._id] || ""}
                onChange={(e) =>
                  setCommentInputs({
                    ...commentInputs,
                    [reel._id]: e.target.value,
                  })
                }
                placeholder="Write comment..."
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                  borderRadius: "20px",
                  padding: "14px",
                  outline: "none",
                  backdropFilter: "blur(12px)",
                }}
              />

              <button
                onClick={() => handleComment(reel._id)}
                style={{
                  border: "none",
                  borderRadius: "18px",
                  background: "#ff3b6b",
                  color: "white",
                  padding: "0 22px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Post
              </button>
            </div>

            {/* COMMENTS */}
            <div
              style={{
                maxHeight: "220px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {reel.comments?.map((comment, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    padding: "12px",
                    borderRadius: "18px",
                    color: "white",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <strong>@{comment.username}</strong>

                  <div
                    style={{
                      marginTop: "4px",
                      color: "#ddd",
                    }}
                  >
                    {comment.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
