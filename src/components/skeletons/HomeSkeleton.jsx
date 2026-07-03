import Skeleton from "react-loading-skeleton";

export default function HomeSkeleton() {
  return (
    <div className="row">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="col-lg-4 col-md-6 mb-4">
          <Skeleton height={320} borderRadius={20} />

          <Skeleton height={35} className="mt-3" />

          <Skeleton count={2} />
        </div>
      ))}
    </div>
  );
}
