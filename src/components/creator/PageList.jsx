import PageCard from "./PageCard";
import "./pagesSidebar.css";
export default function PageList({ pages, currentPage, onPageSelect, onMenu }) {
  if (!pages.length) {
    return (
      <div className="pages-empty">
        <div className="pages-empty-icon">📄</div>

        <h4>No Pages Yet</h4>

        <p>Create your first manga page.</p>
      </div>
    );
  }

  return (
    <div className="page-list">
      {pages.map((page, index) => (
        <PageCard
          key={page.id}
          page={page}
          index={index}
          active={currentPage?.id === page.id}
          onClick={() => onPageSelect(page)}
          onMenu={onMenu}
        />
      ))}
    </div>
  );
}
