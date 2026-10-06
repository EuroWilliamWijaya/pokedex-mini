function SkeletonCard() {
  return (
    <li className="skeleton-card" aria-hidden="true">
      <div className="skeleton-element skeleton-avatar" />
      <div className="skeleton-element skeleton-text-short" />
      <div className="skeleton-element skeleton-text" />
    </li>
  );
}

export default SkeletonCard;
