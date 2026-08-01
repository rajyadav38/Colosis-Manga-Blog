import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs";
import "./pagesSidebar.css";

export default function PageCard({
  page,
  index,
  active,
  onClick,
  onMenu,
  dragHandleProps,
}) {
  return (
    <div className={`page-card ${active ? "active" : ""}`} onClick={onClick}>
      {/* Thumbnail */}

      <img src={page.imageUrl} alt="" className="page-thumbnail" />

      {/* Footer */}

      <div className="page-card-footer">
        <div className="page-title">{page.name || `Page ${index + 1}`}</div>

        <div className="page-actions">
          <button
            className="page-drag-btn"
            {...dragHandleProps}
            onClick={(e) => e.stopPropagation()}
          >
            <BsGripVertical />
          </button>

          <button
            className="page-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              onMenu(e, page);
            }}
          >
            <BsThreeDotsVertical />
          </button>
        </div>
      </div>
    </div>
  );
}
