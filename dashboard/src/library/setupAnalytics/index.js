export const setupAnalytics = ({ hasConsent, trackingId }) => {
  if (hasConsent) {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }

    gtag("js", new Date(Date.now()));
    gtag("config", trackingId, {
      anonymize_ip: true,
      cookie_expires: 7890000,
    });
  }
};
