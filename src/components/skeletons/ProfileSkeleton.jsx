import Skeleton from "react-loading-skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="container py-4">
      <Skeleton height={250} borderRadius={25} />

      <Skeleton height={55} className="mt-4" borderRadius={15} />

      <div className="row mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div className="col-6 col-md-3 mb-4" key={i}>
            <Skeleton height={300} borderRadius={20} />
          </div>
        ))}
      </div>
    </div>
  );
}
