"use client";

import { useEffect, useState } from "react";

const GTM_ID = "GTM-WKS8FF3H";

export function Analytics() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function maybeLoadGtm() {
      if (loaded) return;
      const consent = document.cookie.includes("p2p-consent=true");
      if (!consent) return;
      // Inject GTM
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      script.async = true;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      setLoaded(true);
    }

    maybeLoadGtm();
    window.addEventListener("consent-accepted", maybeLoadGtm);
    return () => window.removeEventListener("consent-accepted", maybeLoadGtm);
  }, [loaded]);

  return null;
}
