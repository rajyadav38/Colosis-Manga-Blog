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
  const [pages, setPages] = useState([]);

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

      if (story.type === "novel" && !chapterContent) {
        alert("Please write chapter content");
        return;
      }

      if (story.type !== "novel" && pages.length === 0) {
        alert("Please add at least one page");
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
            content: story.type === "novel" ? chapterContent : "",

            pages: story.type !== "novel" ? pages : [],
          }),
        });

        alert("Chapter Updated");

        setEditingChapter(null);
        setChapterTitle("");
        setChapterContent("");
        setPages([]);

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
          content: story.type === "novel" ? chapterContent : "",
          pages: story.type !== "novel" ? pages : [],
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

  const addPage = () => {
    setPages([
      ...pages,
      {
        imageUrl: "",
        caption: "",
        pageNumber: pages.length + 1,
      },
    ]);
  };

  const updatePage = (index, field, value) => {
    const updatedPages = [...pages];

    updatedPages[index][field] = value;

    setPages(updatedPages);
  };

  const uploadPageImage = async (file, index) => {
    try {
      const formData = new FormData();

      formData.append("image", file);

      const res = await fetch(`${API_URL}/api/stories/upload-page`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      updatePage(index, "imageUrl", data.imageUrl);
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
              onClick={() => navigate(`/book/${id}`)}
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

          {story.type === "novel" ? (
            <textarea
              className="form-control mb-3"
              rows="10"
              placeholder="Write your chapter..."
              value={chapterContent}
              onChange={(e) => setChapterContent(e.target.value)}
            />
          ) : (
            <>
              <button className="btn btn-success mb-3" onClick={addPage}>
                ➕ Add Page
              </button>

              {pages.map((page, index) => (
                <div key={index} className="card p-3 mb-3 shadow-sm">
                  <h5>📄 Page {index + 1}</h5>

                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={(e) => uploadPageImage(e.target.files[0], index)}
                  />

                  {page.imageUrl && (
                    <img
                      src={page.imageUrl}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        borderRadius: "10px",
                        marginTop: "10px",
                      }}
                    />
                  )}

                  {story.type === "comic" && (
                    <textarea
                      className="form-control"
                      placeholder="Caption"
                      value={page.caption}
                      onChange={(e) =>
                        updatePage(index, "caption", e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            </>
          )}

          <button
            className="btn mb-4"
            style={{
              background: theme.accent,
              color: "white",
            }}
            onClick={handleAddChapter}
          >
            {editingChapter
              ? "💾 Update Chapter"
              : story.type === "novel"
                ? "➕ Add Chapter"
                : "📚 Save Chapter"}
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

                  {story.type === "novel" ? (
                    <p>
                      {chapter.content?.substring(0, 150)}
                      ...
                    </p>
                  ) : (
                    <p>📄 {chapter.pages?.length || 0} Pages</p>
                  )}

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setEditingChapter(chapter);

                        setChapterTitle(chapter.title);

                        setChapterContent(chapter.content || "");

                        setPages(chapter.pages || []);

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
