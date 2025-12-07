import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const routesToResetScroll = [
      '/',              
      '/products',             
    ];

    const dynamicRoutesToReset = [
      '/product/',     
    ];

    let shouldReset = false;

    if (routesToResetScroll.includes(pathname)) {
      shouldReset = true;
    }

    if (!shouldReset) {
      for (const prefix of dynamicRoutesToReset) {
        if (pathname.startsWith(prefix)) {
          shouldReset = true;
          break;
        }
      }
    }

    if (shouldReset) {
      window.scrollTo(0, 0);
    }

  }, [pathname]);

  return null; 
};

export default ScrollToTop;