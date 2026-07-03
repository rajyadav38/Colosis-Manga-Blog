import Skeleton from "react-loading-skeleton";

export default function ScrollsSkeleton() {
  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <Skeleton height={650} borderRadius={30} />
    </div>
  );
}
