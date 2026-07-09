import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function StoryManager({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [activeTab, setActiveTab] = useState("story");
  const [editingChapter, setEditingChapter] = useState(null);

  // LOAD STORY
  const fetchStory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stories/${id}`);

      const data = await res.json();

      setStory(data);
    } catch (error) {
      console.log(error);
    }
  };

  // LOAD CHAPTERS
  const fetchChapters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chapters/${id}`);

      const data = await res.json();

      setChapters(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStory();
    fetchChapters();
  }, []);

  const handleGenerateBook = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stories/generate-book/${id}`, {
        method: "POST",
      });

      const data = await res.json();

      alert(data.message);

      fetchStory();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePublish = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stories/publish/${id}`, {
        method: "PUT",
      });

      const data = await res.json();

      alert(data.message);

      fetchStory();
    } catch (error) {
      console.log(error);
    }
  };

  // ADD CHAPTER
  const handleAddChapter = async () => {
    try {
      if (!chapterTitle) {
        alert("Please enter chapter title");
        return;
      }

      if (!chapterContent.trim()) {
        alert("Please write chapter content");
        return;
      }

      // EDIT MODE
      if (editingChapter) {
        await fetch(`${API_URL}/api/chapters/${editingChapter._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: chapterTitle,
            content: chapterContent,
          }),
        });

        alert("Chapter Updated");

        setEditingChapter(null);
        setChapterTitle("");
        setChapterContent("");

        fetchChapters();
        return;
      }

      // CREATE MODE
      const res = await fetch(`${API_URL}/api/chapters/create`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          storyId: id,
          chapterNumber: chapters.length + 1,
          title: chapterTitle,
          content: chapterContent,
          pages: [],
        }),
      });

      const data = await res.json();

      console.log(data);

      alert("Chapter Added");

      setChapterTitle("");
      setChapterContent("");

      fetchChapters();
    } catch (error) {
      console.log(error);
    }
  };
  const deleteChapter = async (chapterId) => {
    const confirmDelete = window.confirm("Delete this chapter?");

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/api/chapters/${chapterId}`, {
        method: "DELETE",
      });

      fetchChapters();
    } catch (error) {
      console.log(error);
    }
  };

  if (!story) {
    return <div className="container py-5">Loading Story...</div>;
  }

  return (
    <div
      className="container py-4"
      style={{
        color: theme.text,
      }}
    >
      <h1 className="fw-bold mb-2">📚 {story.title}</h1>

      <p className="text-muted">{story.description}</p>

      {story.isPublished && (
        <span className="badge bg-success mb-3">Published</span>
      )}

      <div className="d-flex gap-2 mb-4 mt-3">
        <button
          className={`btn ${
            activeTab === "story" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setActiveTab("story")}
        >
          📖 Story
        </button>

        <button
          className={`btn ${
            activeTab === "chapters" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setActiveTab("chapters")}
        >
          📚 Chapters
        </button>

        <button
          className={`btn ${
            activeTab === "analytics" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setActiveTab("analytics")}
        >
          📊 Analytics
        </button>
      </div>

      {/* STORY TAB */}

      {activeTab === "story" && (
        <>
          <div className="mb-4">
            <button
              className="btn me-2"
              style={{
                background: theme.accent,
                color: "white",
              }}
              onClick={() => {
                if (story.type === "novel") {
                  navigate(`/book/${id}`);
                }

                if (story.type === "manga" || story.type === "comic") {
                  navigate(`/manga/${id}`);
                }
              }}
            >
              📖 Read Story
            </button>

            <button
              className="btn btn-warning me-2"
              onClick={handleGenerateBook}
            >
              🤖 Generate Book
            </button>

            <button className="btn btn-success me-2" onClick={handlePublish}>
              🚀 Publish
            </button>

            <button className="btn btn-dark">📄 Export PDF</button>
          </div>

          <div className="row">
            <div className="col-md-4">
              <img
                src={story.coverImage}
                alt={story.title}
                className="img-fluid rounded shadow"
                style={{
                  maxHeight: "450px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="col-md-8">
              <div className="card shadow border-0">
                <div className="card-body">
                  <h3>{story.title}</h3>

                  <p>{story.description}</p>

                  <hr />

                  <p>
                    <strong>Type:</strong> {story.type}
                  </p>

                  <p>
                    <strong>Genres:</strong> {story.genres?.join(", ")}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {story.isPublished ? "Published" : "Draft"}
                  </p>

                  <p>
                    <strong>Author:</strong> {story.authorUsername}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CHAPTERS TAB */}

      {/* CHAPTERS TAB */}

      {activeTab === "chapters" && (
        <>
          <h3 className="mb-3">Add New Chapter</h3>

          <input
            className="form-control mb-3"
            placeholder="Chapter Title"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />

          <textarea
            className="form-control mb-3"
            rows="12"
            placeholder={
              story.type === "novel"
                ? "Write your chapter..."
                : `Write your ${story.type} chapter...

Example:

Arjun enters the cave and sees a sleeping dragon.
The dragon slowly opens its eyes.
The cave starts shaking...`
            }
            value={chapterContent}
            onChange={(e) => setChapterContent(e.target.value)}
          />

          <button
            className="btn mb-4"
            style={{
              background: theme.accent,
              color: "white",
            }}
            onClick={handleAddChapter}
          >
            {editingChapter ? "💾 Update Chapter" : "➕ Save Chapter"}
          </button>

          <hr />

          <h3 className="mb-3">Existing Chapters</h3>

          {chapters.length === 0 ? (
            <p>No chapters yet.</p>
          ) : (
            chapters.map((chapter) => (
              <div key={chapter._id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5>
                    Chapter {chapter.chapterNumber}: {chapter.title}
                  </h5>

                  <p
                    style={{
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {chapter.content?.substring(0, 250)}
                    {chapter.content?.length > 250 && "..."}
                  </p>

                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setEditingChapter(chapter);
                        setChapterTitle(chapter.title);
                        setChapterContent(chapter.content || "");

                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteChapter(chapter._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* ANALYTICS TAB */}

      {activeTab === "analytics" && (
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow border-0">
              <div className="card-body">
                <h5>👁 Views</h5>
                <h1>{story.views}</h1>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow border-0">
              <div className="card-body">
                <h5>❤️ Likes</h5>
                <h1>{story.likes}</h1>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow border-0">
              <div className="card-body">
                <h5>📚 Chapters</h5>
                <h1>{chapters.length}</h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
