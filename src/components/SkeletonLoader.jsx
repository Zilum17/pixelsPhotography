import '../css/SkeletorLoader.css';

const SkeletonLoader = ({ type }) => {
  const getSkeleton = () => {
    switch (type) {
      case 'image':
        return <div className="skeleton-line skeleton-image"></div>;
      case 'title':
        return <div className="skeleton-line skeleton-title"></div>;
      case 'text':
        return <div className="skeleton-line skeleton-text-short"></div>;
      case 'text-long':
        return <div className="skeleton-line skeleton-text-long"></div>;
      case 'product-card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-line skeleton-image"></div>
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-text-short"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return getSkeleton();
};

export default SkeletonLoader;