import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortablePageCard from "./SortablePageCard";
import "./pagesSidebar.css";

export default function PageList({
  pages,
  currentPage,
  onPageSelect,
  onMenu,
  onReorder,
}) {
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
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;

        onReorder?.(active.id, over.id);
      }}
    >
      <SortableContext
        items={pages.map((page) => page._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="page-list">
          {pages.map((page, index) => (
            <SortablePageCard
              key={page._id}
              page={page}
              index={index}
              active={currentPage?._id === page._id}
              onClick={() => onPageSelect(page)}
              onMenu={onMenu}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
