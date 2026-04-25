export const trackEvent = (eventName, params = {}) => {
  try {
    if (window.gtag) {
      window.gtag('event', eventName, {
        ...params,
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn("Analytics error:", err);
  }
};
