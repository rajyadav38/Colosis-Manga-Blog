import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function StoryManager({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);

  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");

  // LOAD STORY
  const fetchStory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/stories/${id}`);

      const data = await res.json();

      setStory(data);
    } catch (error) {
      console.log(error);
    }
  };

  // LOAD CHAPTERS
  const fetchChapters = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/chapters/${id}`);

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

  // ADD CHAPTER
  const handleAddChapter = async () => {
    try {
      if (!chapterTitle || !chapterContent) {
        alert("Please fill all fields");
        return;
      }

      const res = await fetch("http://localhost:5000/api/chapters/create", {
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
      <button
        className="btn me-2"
        style={{
          background: theme.accent,
          color: "white",
        }}
        onClick={() => navigate(`/story/read/${id}`)}
      >
        📖 Read Story
      </button>
      <button className="btn btn-warning">🤖 Generate Book</button>

      <button className="btn btn-success">🚀 Publish</button>

      <button className="btn btn-dark">📄 Export PDF</button>
      <hr />

      <h3 className="mb-3">Add New Chapter</h3>

      <input
        className="form-control mb-3"
        placeholder="Chapter Title"
        value={chapterTitle}
        onChange={(e) => setChapterTitle(e.target.value)}
      />

      <textarea
        className="form-control mb-3"
        rows="10"
        placeholder="Write your chapter..."
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
        Add Chapter
      </button>

      <hr />

      <h3 className="mb-3">Existing Chapters</h3>

      {chapters.length === 0 ? (
        <p>No chapters yet.</p>
      ) : (
        chapters.map((chapter) => (
          <div key={chapter._id} className="card mb-3">
            <div className="card-body">
              <h5>
                Chapter {chapter.chapterNumber}: {chapter.title}
              </h5>

              <p>
                {chapter.content.substring(0, 150)}
                ...
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
