import React from "react";

export default function PropertiesPanel({
  selectedElement,
  updateSelected,
  deleteSelected,
  save,
}) {
  return (
    <div
      className="rounded shadow p-3"
      style={{
        background: "white",
        minHeight: "80vh",
      }}
    >
      <h4 className="fw-bold mb-4">Properties</h4>

      {!selectedElement && (
        <>
          <p className="text-muted">Select a speech bubble or text to edit.</p>

          <button className="btn btn-success w-100 mt-4" onClick={save}>
            💾 Save Chapter
          </button>
        </>
      )}

      {selectedElement && (
        <>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              {selectedElement.type === "bubble" ? "Dialogue" : "Text"}
            </label>

            <textarea
              className="form-control"
              rows={4}
              value={selectedElement.text}
              onChange={(e) =>
                updateSelected({
                  text: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Font Size</label>

            <input
              type="range"
              min="12"
              max="60"
              value={selectedElement.fontSize}
              className="form-range"
              onChange={(e) =>
                updateSelected({
                  fontSize: Number(e.target.value),
                })
              }
            />

            <small>{selectedElement.fontSize}px</small>
          </div>

          {selectedElement.type === "bubble" && (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold">Width</label>

                <input
                  type="range"
                  min="80"
                  max="500"
                  value={selectedElement.width}
                  className="form-range"
                  onChange={(e) =>
                    updateSelected({
                      width: Number(e.target.value),
                    })
                  }
                />

                <small>{selectedElement.width}px</small>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Height</label>

                <input
                  type="range"
                  min="60"
                  max="300"
                  value={selectedElement.height}
                  className="form-range"
                  onChange={(e) =>
                    updateSelected({
                      height: Number(e.target.value),
                    })
                  }
                />

                <small>{selectedElement.height}px</small>
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold">Rotation</label>

            <input
              type="range"
              min="-180"
              max="180"
              value={selectedElement.rotation}
              className="form-range"
              onChange={(e) =>
                updateSelected({
                  rotation: Number(e.target.value),
                })
              }
            />

            <small>{selectedElement.rotation}°</small>
          </div>

          <button
            className="btn btn-danger w-100 mb-3"
            onClick={() => {
              deleteSelected();

              if (window.creatorStudioDelete) {
                window.creatorStudioDelete();
              }
            }}
          >
            🗑 Delete Element
          </button>

          <button className="btn btn-success w-100" onClick={save}>
            💾 Save Chapter
          </button>
        </>
      )}
    </div>
  );
}
