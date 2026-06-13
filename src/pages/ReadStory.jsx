import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ReadStory({ theme }) {
  const { id } = useParams();

  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    fetchStory();
    fetchChapters();
  }, []);

  const fetchStory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/stories/${id}`);

      const data = await res.json();

      setStory(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChapters = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/chapters/${id}`);

      const data = await res.json();

      setChapters(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!story) {
    return <div className="container py-5">Loading Story...</div>;
  }

  return (
    <div
      className="container py-5"
      style={{
        maxWidth: "900px",
        color: theme.text,
      }}
    >
      <div
        className="p-5 rounded shadow-lg"
        style={{
          background: theme.card,
        }}
      >
        <h1 className="fw-bold mb-2">{story.title}</h1>

        <p className="text-muted">by @{story.authorUsername}</p>

        <hr />

        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.9",
          }}
        >
          {story.description}
        </p>

        <hr className="my-4" />

        {chapters.map((chapter) => (
          <div key={chapter._id} className="mb-5">
            <h2 className="fw-bold">Chapter {chapter.chapterNumber}</h2>

            <h4 className="mb-4">{chapter.title}</h4>

            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "2",
                fontSize: "18px",
              }}
            >
              {chapter.content}
            </div>

            <hr className="mt-5" />
          </div>
        ))}
      </div>
    </div>
  );
}
