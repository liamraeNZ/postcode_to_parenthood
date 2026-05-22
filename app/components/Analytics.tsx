"use client";

import { useEffect, useRef } from "react";

const GTM_ID = "GTM-WKS8FF3H";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Loads GTM immediately with Google Consent Mode v2.
 * Analytics consent is denied by default and granted only
 * when the user accepts the cookie banner.
 */
export function Analytics() {
  const scriptInjected = useRef(false);

  useEffect(() => {
    if (scriptInjected.current) return;
    scriptInjected.current = true;

    // Initialize dataLayer and gtag helper
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments as unknown as Record<string, unknown>);
    };

    // Set default consent state — denied until user accepts
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });

    // If user already accepted in a previous session, grant immediately
    if (document.cookie.includes("p2p-consent=true")) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }

    // Push GTM start event and inject script
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Listen for consent acceptance from the cookie banner
    function onConsentAccepted() {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }

    window.addEventListener("consent-accepted", onConsentAccepted);
    return () => window.removeEventListener("consent-accepted", onConsentAccepted);
  }, []);

  return null;
}
