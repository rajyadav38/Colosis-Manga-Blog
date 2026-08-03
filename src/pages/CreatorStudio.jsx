import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import CanvasEditor from "../components/creator/CanvasEditor";
import PropertiesPanel from "../components/creator/PropertiesPanel";
import "../styles/CreatorStudio.css";
import LayersPanel from "../components/creator/LayersPanel";
import PagesSidebar from "../components/creator/PagesSidebar";
import PageContextMenu from "../components/creator/PageContextMenu";
import RenamePageModal from "../components/creator/RenamePageModal";
import DeletePageModal from "../components/creator/DeletePageModal";
import Toast from "../components/creator/Toast";
export default function CreatorStudio({ theme }) {
  const { chapterId } = useParams();

  const API_URL = process.env.REACT_APP_API_URL;

  const [chapter, setChapter] = useState(null);
  const pageRenderedRef = useRef(null);
  const [pages, setPages] = useState([]);

  const [selectedPage, setSelectedPage] = useState(null);

  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState(null);
  const [editorElements, setEditorElements] = useState([]);
  const [editorSelectedId, setEditorSelectedId] = useState(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState("properties");
  const [pageMenuVisible, setPageMenuVisible] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const [pageMenuPosition, setPageMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const [menuPage, setMenuPage] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const [publishProgress, setPublishProgress] = useState({
    current: 0,
    total: 0,
  });

  useEffect(() => {
    fetchChapter();
    // eslint-disable-next-line
  }, []);

  const waitForPageRender = () => {
    return new Promise((resolve) => {
      pageRenderedRef.current = resolve;
    });
  };

  const handlePageRendered = () => {
    if (pageRenderedRef.current) {
      pageRenderedRef.current();
      pageRenderedRef.current = null;
    }
  };
  const dataURLToBlob = async (dataURL) => {
    const response = await fetch(dataURL);
    return await response.blob();
  };

  const publishPage = async (page) => {
    const exportFn = window.creatorStudioExport;

    if (!exportFn) {
      throw new Error("Canvas export not available");
    }

    const dataURL = exportFn();

    const blob = await dataURLToBlob(dataURL);

    const formData = new FormData();

    formData.append("image", blob, `page-${page.pageNumber}.png`);

    const res = await fetch(
      `${API_URL}/api/chapters/${chapterId}/page/${page.pageNumber}/publish`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      throw new Error("Publish failed");
    }

    return await res.json();
  };
  const publishChapter = async () => {
    if (!pages.length) return;

    try {
      setPublishing(true);

      for (const page of pages) {
        setSelectedPage(page);

        await waitForPageRender();

        await publishPage(page);

        setPublishProgress({
          current: page.pageNumber,
          total: pages.length,
        });
      }

      await fetchChapter();

      setToast({
        open: true,
        message: "🚀 Chapter Published",
        type: "success",
      });
    } catch (err) {
      console.log(err);

      setToast({
        open: true,
        message: "Publish Failed",
        type: "error",
      });
    } finally {
      setPublishing(false);
    }
  };

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

  const renamePage = async (pageId, name) => {
    try {
      await fetch(
        `${API_URL}/api/chapters/${chapterId}/page/${pageId}/rename`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        },
      );

      setToast({
        open: true,
        message: "✅ Page renamed",
        type: "success",
      });
      await fetchChapter();
    } catch (err) {
      console.log(err);
    }
  };
  const duplicatePage = async (pageId) => {
    try {
      await fetch(
        `${API_URL}/api/chapters/${chapterId}/page/${pageId}/duplicate`,
        {
          method: "POST",
        },
      );

      setToast({
        open: true,
        message: "📄 Page duplicated",
        type: "success",
      });
      await fetchChapter();
    } catch (err) {
      console.log(err);
    }
  };

  const deletePage = async (pageId) => {
    try {
      await fetch(`${API_URL}/api/chapters/${chapterId}/page/${pageId}`, {
        method: "DELETE",
      });

      setToast({
        open: true,
        message: "🗑 Page deleted",
        type: "success",
      });
      await fetchChapter();
    } catch (err) {
      console.log(err);
    }
  };
  const reorderPages = async (activeId, overId) => {
    const oldIndex = pages.findIndex((p) => p._id === activeId);
    const newIndex = pages.findIndex((p) => p._id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const updatedPages = [...pages];

    const [moved] = updatedPages.splice(oldIndex, 1);

    updatedPages.splice(newIndex, 0, moved);

    // Update page numbers locally
    updatedPages.forEach((page, index) => {
      page.pageNumber = index + 1;
    });

    // Instant UI update
    setPages(updatedPages);

    // Keep selected page selected
    const selected = updatedPages.find((p) => p._id === selectedPage?._id);

    if (selected) {
      setSelectedPage(selected);
    }

    try {
      await fetch(`${API_URL}/api/chapters/${chapterId}/pages/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pages: updatedPages,
        }),
      });

      setToast({
        open: true,
        message: "Page Ordered",
        type: "success",
      });
      await fetchChapter();
    } catch (err) {
      console.log(err);
    }
  };

  const handleNewPage = () => {
    document.getElementById("upload-page-input")?.click();
  };

  const handlePageMenu = (event, page) => {
    event.stopPropagation();

    setMenuPage(page);

    setPageMenuPosition({
      x: event.clientX,
      y: event.clientY,
    });

    setPageMenuVisible(true);
  };

  const saveElements = async (elements) => {
    if (!selectedPage) return false;

    try {
      const res = await fetch(
        `${API_URL}/api/chapters/${chapterId}/page/${selectedPage._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ elements }),
        },
      );

      if (!res.ok) {
        return false;
      }

      await fetchChapter();

      return true;
    } catch (err) {
      console.log(err);
      return false;
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
        <div className="creator-panel">
          <PagesSidebar
            pages={pages}
            currentPage={selectedPage}
            setCurrentPage={setSelectedPage}
            onNewPage={handleNewPage}
            onPageMenu={handlePageMenu}
            onReorder={reorderPages}
          />

          {/* Hidden Upload */}

          <input
            id="upload-page-input"
            hidden
            type="file"
            accept="image/*"
            onChange={uploadPage}
          />
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
                onElementsChange={setEditorElements}
                onSelectionChange={setEditorSelectedId}
                onPageRendered={handlePageRendered}
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

        <div className="creator-panel">
          <div className="sidebar-tabs">
            <button
              className={activeSidebarTab === "properties" ? "active" : ""}
              onClick={() => setActiveSidebarTab("properties")}
            >
              Properties
            </button>

            <button
              className={activeSidebarTab === "layers" ? "active" : ""}
              onClick={() => setActiveSidebarTab("layers")}
            >
              Layers
            </button>
          </div>

          {activeSidebarTab === "properties" ? (
            <PropertiesPanel
              selectedElement={selectedElement}
              updateSelected={updateSelected}
              deleteSelected={deleteSelected}
              publishChapter={publishChapter}
            />
          ) : (
            <LayersPanel
              elements={editorElements}
              selectedId={editorSelectedId}
              toggleVisibility={(id) =>
                window.creatorStudioToggleVisibility?.(id)
              }
              toggleLock={(id) => window.creatorStudioToggleLock?.(id)}
              renameLayer={(id, name) =>
                window.creatorStudioRenameLayer?.(id, name)
              }
              reorderLayers={(activeId, overId) =>
                window.creatorStudioReorderLayers?.(activeId, overId)
              }
              duplicateLayer={(id) => window.creatorStudioDuplicate?.(id)}
              deleteLayer={(id) => window.creatorStudioDelete?.(id)}
              moveLayer={(id, direction) =>
                window.creatorStudioMoveLayer?.(id, direction)
              }
            />
          )}
        </div>
      </div>
      <PageContextMenu
        visible={pageMenuVisible}
        x={pageMenuPosition.x}
        y={pageMenuPosition.y}
        onRename={() => {
          setRenameModalOpen(true);
          setPageMenuVisible(false);
        }}
        onDuplicate={() => {
          duplicatePage(menuPage._id);
          setPageMenuVisible(false);
        }}
        onDelete={() => {
          setDeleteModalOpen(true);
          setPageMenuVisible(false);
        }}
        onMoveUp={() => {
          console.log("Move Up", menuPage);
          setPageMenuVisible(false);
        }}
        onMoveDown={() => {
          console.log("Move Down", menuPage);
          setPageMenuVisible(false);
        }}
        onClose={() => {
          setPageMenuVisible(false);
          setMenuPage(null);
        }}
      />
      <RenamePageModal
        open={renameModalOpen}
        page={menuPage}
        onClose={() => setRenameModalOpen(false)}
        onSave={async (name) => {
          await renamePage(menuPage._id, name);

          setRenameModalOpen(false);
        }}
      />
      <DeletePageModal
        open={deleteModalOpen}
        page={menuPage}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={async () => {
          await deletePage(menuPage._id);

          setDeleteModalOpen(false);
        }}
      />
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </div>
  );
}
