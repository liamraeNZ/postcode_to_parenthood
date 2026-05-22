"use client";

import { useEffect, useState } from "react";

const GTM_ID = "GTM-WKS8FF3H";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function Analytics() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function maybeLoadGtm() {
      if (loaded) return;
      const consent = document.cookie.includes("p2p-consent=true");
      if (!consent) return;

      // Initialize dataLayer before injecting the script
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

      // Inject GTM script
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      script.async = true;
      document.head.appendChild(script);

      setLoaded(true);
    }

    maybeLoadGtm();
    window.addEventListener("consent-accepted", maybeLoadGtm);
    return () => window.removeEventListener("consent-accepted", maybeLoadGtm);
  }, [loaded]);

  return null;
}
