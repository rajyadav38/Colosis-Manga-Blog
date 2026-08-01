import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PageCard from "./PageCard";

export default function SortablePageCard(props) {
  const { page } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: page._id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <PageCard
        {...props}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}
