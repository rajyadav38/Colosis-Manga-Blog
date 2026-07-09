import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CreatorStudio.css";
export default function CreatorStudio({ theme }) {
  const { chapterId } = useParams();

  const API_URL = process.env.REACT_APP_API_URL;

  const [chapter, setChapter] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);

  // =============================
  // Load Chapter
  // =============================

  const fetchChapter = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chapters/details/${chapterId}`);

      const data = await res.json();

      setChapter(data);
      setPages(data.pages || []);

      if (data.pages && data.pages.length > 0) {
        setSelectedPage(data.pages[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChapter();
  }, []);

  // =============================
  // Upload Manga Page
  // =============================

  const handleUploadPage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Upload to Cloudinary
      const uploadRes = await fetch(`${API_URL}/api/stories/upload-page`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      // Save inside chapter
      await fetch(`${API_URL}/api/chapters/${chapterId}/add-page`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
        }),
      });

      fetchChapter();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: theme.bg,
        minHeight: "100vh",
        color: theme.text,
      }}
    >
      <h2 className="fw-bold mb-4">🎨 Creator Studio</h2>

      <div className="row">
        {/* ================= LEFT SIDEBAR ================= */}

        <div className="col-md-2">
          <div
            className="p-3 rounded shadow"
            style={{
              background: theme.card,
              minHeight: "80vh",
            }}
          >
            <h5>Pages</h5>

            {pages.length === 0 ? (
              <p className="text-muted">No pages uploaded</p>
            ) : (
              pages.map((page) => (
                <img
                  key={page.id || page.pageNumber}
                  src={page.imageUrl}
                  alt=""
                  className="page-thumb"
                  onClick={() => setSelectedPage(page)}
                />
              ))
            )}
          </div>
        </div>

        {/* ================= CANVAS ================= */}

        <div className="col-md-8">
          <div
            className="rounded shadow d-flex justify-content-center align-items-center"
            style={{
              background: "#222",
              height: "80vh",
              border: "2px dashed #555",
              overflow: "hidden",
            }}
          >
            {selectedPage ? (
              <img
                src={selectedPage.imageUrl}
                alt=""
                className="canvas-image"
              />
            ) : (
              <h3 style={{ color: "#777" }}>Manga Canvas</h3>
            )}
          </div>
        </div>

        {/* ================= TOOLS ================= */}

        <div className="col-md-2">
          <div
            className="p-3 rounded shadow"
            style={{
              background: theme.card,
              minHeight: "80vh",
            }}
          >
            <h5>Tools</h5>

            <input
              type="file"
              id="uploadPage"
              hidden
              accept="image/*"
              onChange={handleUploadPage}
            />

            <button
              className="btn btn-primary w-100 mb-2"
              onClick={() => document.getElementById("uploadPage").click()}
            >
              Upload Page
            </button>

            <button className="btn btn-secondary w-100 mb-2" disabled>
              Speech Bubble
            </button>

            <button className="btn btn-secondary w-100" disabled>
              Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
