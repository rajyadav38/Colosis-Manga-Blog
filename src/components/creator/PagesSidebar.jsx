import { BsBook, BsPlusCircle } from "react-icons/bs";
import PageList from "./PageList";
import "./pagesSidebar.css";
export default function PagesSidebar({
  pages = [],
  currentPage,
  setCurrentPage,
  onNewPage,
  onPageMenu,
  onReorder,
}) {
  return (
    <div className="pages-sidebar">
      {/* Header */}

      <div className="pages-sidebar-header">
        <div className="pages-sidebar-title">
          <BsBook />

          <span>Chapter Pages</span>
        </div>

        <button className="new-page-btn" onClick={onNewPage}>
          <BsPlusCircle />

          <span>New</span>
        </button>
      </div>

      {/* List */}

      <PageList
        pages={pages}
        currentPage={currentPage}
        onPageSelect={setCurrentPage}
        onMenu={onPageMenu}
        onReorder={onReorder}
      />

      {/* Footer */}

      <div className="pages-sidebar-footer">
        {pages.length} {pages.length === 1 ? "Page" : "Pages"}
      </div>
    </div>
  );
}
