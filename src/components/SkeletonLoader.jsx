import '../css/SkeletorLoader.css';
import CirclePulseLoader from './CirclePulseLoader';

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
      case 'product-card-home':
        return (
          <div className="min-w-54 w-54 h-full p-2 flex flex-col gap-1 justify-between">
            <div className="bg-white size-40 min-w-40 flex items-center justify-center p-6 rounded-md">
              <CirclePulseLoader />
            </div>
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