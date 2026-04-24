// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// /**
//  * Google Analytics component to track page views
//  * Replace G-XXXXXXXXXX with your actual GA4 Measurement ID
//  */
// const GA_MEASUREMENT_ID = 'G-HBB7Z753E6'; // TODO: Replace with real ID

// const GoogleAnalytics = () => {
//   const location = useLocation();

//   useEffect(() => {
//     if (GA_MEASUREMENT_ID === 'G-HBB7Z753E6') return;

//     // Initialize GA if not already done
//     if (!window.gtag) {
//       const script1 = document.createElement('script');
//       script1.async = true;
//       script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
//       document.head.appendChild(script1);

//       const script2 = document.createElement('script');
//       script2.innerHTML = `
//         window.dataLayer = window.dataLayer || [];
//         function gtag(){dataLayer.push(arguments);}
//         gtag('js', new Date());
//         gtag('config', '${GA_MEASUREMENT_ID}');
//       `;
//       document.head.appendChild(script2);
//     }

//     // Track page view on route change
//     window.gtag('config', GA_MEASUREMENT_ID, {
//       page_path: location.pathname + location.search,
//     });
//   }, [location]);

//   return null;
// };

// export default GoogleAnalytics;
