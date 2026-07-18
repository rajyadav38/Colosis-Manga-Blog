import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CanvasEditor from "../components/creator/CanvasEditor";
import PropertiesPanel from "../components/creator/PropertiesPanel";
import "../styles/CreatorStudio.css";
export default function CreatorStudio({ theme }) {
  const { chapterId } = useParams();

  const API_URL = process.env.REACT_APP_API_URL;

  const [chapter, setChapter] = useState(null);

  const [pages, setPages] = useState([]);

  const [selectedPage, setSelectedPage] = useState(null);

  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState(null);

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
  const updateSelected = (changes) => {
    if (!selectedElement) return;

    setSelectedElement({
      ...selectedElement,
      ...changes,
    });

    const updatedPages = [...pages];

    const pageIndex = updatedPages.findIndex(
      (p) => p.pageNumber === selectedPage.pageNumber,
    );

    if (pageIndex === -1) return;

    updatedPages[pageIndex].elements = updatedPages[pageIndex].elements.map(
      (el) =>
        el.id === selectedElement.id
          ? {
              ...el,
              ...changes,
            }
          : el,
    );

    setPages(updatedPages);

    setSelectedPage(updatedPages[pageIndex]);
  };

  const deleteSelected = () => {
    if (!selectedElement) return;

    const updatedPages = [...pages];

    const pageIndex = updatedPages.findIndex(
      (p) => p.pageNumber === selectedPage.pageNumber,
    );

    updatedPages[pageIndex].elements = updatedPages[pageIndex].elements.filter(
      (el) => el.id !== selectedElement.id,
    );

    setPages(updatedPages);

    setSelectedPage(updatedPages[pageIndex]);

    setSelectedElement(null);
  };

  return (
    <div
      className="creator-studio"
      style={{
        background: theme.bg,
        minHeight: "100vh",
        color: theme.text,
      }}
    >
      <h2 className="creator-title">🎨 Creator Studio</h2>

      <div className="creator-layout">
        {/* LEFT SIDEBAR */}

        <div className="creator-panel">
          <div
            className="rounded shadow p-3"
            style={{
              background: theme.card,
              minHeight: "80vh",
            }}
          >
            <h4 className="pages-title">Chapter Pages</h4>

            <label className="btn btn-primary upload-btn">
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

        <div className="canvas-panel">
          {selectedPage ? (
            <div className="canvas-workspace">
              <CanvasEditor
                page={selectedPage}
                chapterId={chapter._id}
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                saveElements={saveElements}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
              />
            </div>
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

        <div className="creator-panel">
          <PropertiesPanel
            selectedElement={selectedElement}
            updateSelected={updateSelected}
            deleteSelected={deleteSelected}
            save={() => {
              const fn = window.creatorStudioSave;

              if (fn) {
                fn();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
