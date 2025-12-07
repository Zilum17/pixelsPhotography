
import '../css/CirclePulseLoader.css';

const CirclePulseLoader = ({ size = '64px' }) => {
  return (
    <div 
      className="circle-loader-container" 
      style={{ width: size, height: size }}
    >
      <div className="circle-pulse"></div>
    </div>
  );
};

export default CirclePulseLoader;