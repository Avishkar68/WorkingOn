import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Google Analytics component to track page views
 */
const GA_MEASUREMENT_ID = 'G-HBB7Z753E6'; 

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

    // Initialize GA if not already done (though it's in index.html, we track route changes here)
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

export default GoogleAnalytics;
