import React from "react";

export default function PropertiesPanel({
  selectedElement,
  updateSelected,
  deleteSelected,
  publishChapter,
}) {
  return (
    <div className="properties-panel">
      <div className="properties-header">
        <h4>
          <i className="bi bi-sliders"></i>
          <span>Properties</span>
        </h4>
      </div>

      {/* ================= EMPTY STATE ================= */}

      {!selectedElement && (
        <>
          <div className="properties-empty">
            <i className="bi bi-cursor-fill"></i>

            <h5>No Object Selected</h5>

            <p>Select a speech bubble or text layer to edit its properties.</p>
          </div>

          <button
            className="btn btn-success w-100 mt-4"
            onClick={publishChapter}
          >
            🚀 Publish Chapter
          </button>
        </>
      )}

      {/* ================= SELECTED ================= */}

      {selectedElement && (
        <>
          {/* Selected Object */}

          <div className="property-card">
            <div className="property-card-title">
              <i
                className={
                  selectedElement.type === "bubble"
                    ? "bi bi-chat-square-text-fill"
                    : "bi bi-fonts"
                }
              />

              <span>
                {selectedElement.type === "bubble"
                  ? "Speech Bubble"
                  : "Text Layer"}
              </span>
            </div>

            <textarea
              className="property-textarea"
              rows={4}
              value={selectedElement.text}
              onChange={(e) =>
                updateSelected({
                  text: e.target.value,
                })
              }
            />
          </div>

          {/* Appearance */}

          <div className="property-card">
            <div className="property-card-title">
              <i className="bi bi-palette-fill"></i>
              <span>Appearance</span>
            </div>

            <label>Font Size</label>

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

            <div className="property-value">{selectedElement.fontSize}px</div>
          </div>

          {/* Bubble */}

          {selectedElement.type === "bubble" && (
            <div className="property-card">
              <div className="property-card-title">
                <i className="bi bi-aspect-ratio-fill"></i>
                <span>Bubble</span>
              </div>

              <label>Width</label>

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

              <div className="property-value">{selectedElement.width}px</div>

              <label className="mt-3">Height</label>

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

              <div className="property-value">{selectedElement.height}px</div>
            </div>
          )}

          {/* Transform */}

          <div className="property-card">
            <div className="property-card-title">
              <i className="bi bi-bounding-box"></i>
              <span>Transform</span>
            </div>

            <label>Rotation</label>

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

            <div className="property-value">{selectedElement.rotation}°</div>
          </div>

          {/* Actions */}

          <div className="property-card">
            <div className="property-card-title">
              <i className="bi bi-lightning-fill"></i>
              <span>Actions</span>
            </div>

            <button
              className="action-btn delete-btn mb-3"
              onClick={() => {
                deleteSelected();

                if (window.creatorStudioDelete) {
                  window.creatorStudioDelete();
                }
              }}
            >
              <i className="bi bi-trash-fill"></i>
              Delete Element
            </button>

            <button className="btn btn-success w-100" onClick={publishChapter}>
              🚀 Publish Chapter
            </button>
          </div>
        </>
      )}
    </div>
  );
}
