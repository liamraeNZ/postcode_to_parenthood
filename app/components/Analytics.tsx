"use client";

import { useEffect, useRef } from "react";

const GA_MEASUREMENT_ID = "G-WLXJK78YSL";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Loads the Google tag (gtag.js) immediately with Consent Mode v2.
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
      window.dataLayer.push(arguments);
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

    // Load gtag.js with the GA4 measurement ID
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);

    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
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
