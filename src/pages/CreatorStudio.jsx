import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CanvasEditor from "../components/creator/CanvasEditor";

export default function CreatorStudio({ theme }) {
  const { chapterId } = useParams();

  const API_URL = process.env.REACT_APP_API_URL;

  const [chapter, setChapter] = useState(null);

  const [pages, setPages] = useState([]);

  const [selectedPage, setSelectedPage] = useState(null);

  const [selectedTool, setSelectedTool] = useState("select");

  useEffect(() => {
    fetchChapter();
    // eslint-disable-next-line
  }, []);

  const fetchChapter = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chapters/details/${chapterId}`);

      const data = await res.json();

      setChapter(data);

      setPages(data.pages || []);

      if (data.pages?.length > 0) {
        setSelectedPage(data.pages[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadPage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const formData = new FormData();

      formData.append("image", file);

      const uploadRes = await fetch(`${API_URL}/api/stories/upload-page`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      const res = await fetch(`${API_URL}/api/chapters/${chapterId}/add-page`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
        }),
      });

      const updated = await res.json();

      setChapter(updated);

      setPages(updated.pages);

      setSelectedPage(updated.pages[updated.pages.length - 1]);
    } catch (err) {
      console.log(err);
    }
  };

  const saveElements = async (elements) => {
    if (!selectedPage) return;

    try {
      await fetch(
        `${API_URL}/api/chapters/${chapterId}/page/${selectedPage.pageNumber}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            elements,
          }),
        },
      );

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
        {/* LEFT SIDEBAR */}

        <div className="col-lg-2">
          <div
            className="rounded shadow p-3"
            style={{
              background: theme.card,
              minHeight: "80vh",
            }}
          >
            <h5 className="mb-3">Pages</h5>

            <label className="btn btn-primary w-100 mb-3">
              Upload Page
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={uploadPage}
              />
            </label>

            {pages.map((page) => (
              <img
                key={page.pageNumber}
                src={page.imageUrl}
                alt=""
                onClick={() => setSelectedPage(page)}
                style={{
                  width: "100%",
                  marginBottom: 12,
                  borderRadius: 10,
                  cursor: "pointer",

                  border:
                    selectedPage?.pageNumber === page.pageNumber
                      ? "3px solid #ff4d6d"
                      : "2px solid transparent",
                }}
              />
            ))}
          </div>
        </div>

        {/* CENTER */}

        <div className="col-lg-8">
          {selectedPage ? (
            <CanvasEditor
              page={selectedPage}
              chapterId={chapterId}
              selectedTool={selectedTool}
              saveElements={saveElements}
            />
          ) : (
            <div
              className="rounded d-flex justify-content-center align-items-center"
              style={{
                height: "80vh",
                background: "#222",
              }}
            >
              Upload your first manga page.
            </div>
          )}
        </div>

        {/* RIGHT TOOLBAR */}

        <div className="col-lg-2">
          <div
            className="rounded shadow p-3"
            style={{
              background: theme.card,
              minHeight: "80vh",
            }}
          >
            <h5 className="mb-3">Tools</h5>

            <button
              className={`btn w-100 mb-2 ${
                selectedTool === "select"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setSelectedTool("select")}
            >
              Select
            </button>

            <button
              className={`btn w-100 mb-2 ${
                selectedTool === "bubble"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setSelectedTool("bubble")}
            >
              💬 Speech Bubble
            </button>

            <button
              className={`btn w-100 mb-2 ${
                selectedTool === "text" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setSelectedTool("text")}
            >
              📝 Text
            </button>

            <hr />

            <button
              className="btn btn-success w-100"
              onClick={() => {
                const editor = window.creatorStudioSave;

                if (editor) {
                  editor();
                }
              }}
            >
              💾 Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
