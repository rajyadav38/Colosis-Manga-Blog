import { BsThreeDotsVertical, BsFileEarmark } from "react-icons/bs";
import "./pagesSidebar.css";
export default function PageCard({ page, active, index, onClick, onMenu }) {
  return (
    <div className={`page-card ${active ? "active" : ""}`} onClick={onClick}>
      {/* Header */}

      <div className="page-card-header">
        <div className="page-title">
          <BsFileEarmark />

          <span>{page.name || `Page ${index + 1}`}</span>
        </div>

        <button
          className="page-menu-btn"
          onClick={(e) => {
            e.stopPropagation();
            onMenu?.(e, page);
          }}
        >
          <BsThreeDotsVertical />
        </button>
      </div>

      {/* Thumbnail */}

      <div className="page-thumbnail">
        {page.imageUrl ? (
          <img src={page.imageUrl} alt={page.name} />
        ) : (
          <div className="thumbnail-placeholder">
            <BsFileEarmark size={40} />

            <span>Blank Page</span>
          </div>
        )}
      </div>

      {/* Footer */}

      <div className="page-footer">
        <span>{page.imageUrl ? "Image Uploaded" : "Blank Page"}</span>
      </div>
    </div>
  );
}
