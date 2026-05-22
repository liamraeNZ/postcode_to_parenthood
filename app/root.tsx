import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction } from "react-router";
import type { Route } from "./+types/root";
import { type ReactNode, useState, useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import { Navbar } from "./components/layout/Navbar";
import { SiteFooter } from "./components/layout/SiteFooter";
import { RouteErrorBoundary } from "./components/errors/RouteErrorBoundary";
import { Analytics } from "./components/Analytics";
import "./index.css";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
  { rel: "manifest", href: "/site.webmanifest" },
];

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  const result = await db
    .prepare(
      `SELECT MAX(last_verified) as last_updated FROM health_boards WHERE data_confidence = 'confirmed'`
    )
    .bind()
    .first<{ last_updated: string | null }>();

  return { lastUpdated: result?.last_updated ?? null };
}

function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : null;
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7C6A5B" />
        <meta name="color-scheme" content="light" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen bg-page font-sans selection:bg-warm selection:text-ink flex flex-col">
          <Navbar />
          <main className="relative flex flex-1 flex-col pt-16 md:pt-20">{children}</main>
          <SiteFooter />
        </div>
        <ScrollRestoration />
        <Scripts />
        <Analytics />
        <ClientOnly>
          <CookieConsent
            location="bottom"
            buttonText="Accept"
            declineButtonText="Decline"
            enableDeclineButton
            cookieName="p2p-consent"
            expires={365}
            onAccept={() => window.dispatchEvent(new Event("consent-accepted"))}
            style={{ background: "#2a2a2a" }}
            buttonStyle={{ background: "#2a9d8f", color: "#fff", borderRadius: "9999px", padding: "8px 20px" }}
            declineButtonStyle={{ background: "transparent", border: "1px solid #fff", color: "#fff", borderRadius: "9999px", padding: "8px 20px" }}
          >
            We use cookies for analytics to understand how you use this site.{" "}
            <Link to="/privacy" className="underline">Learn more</Link>
          </CookieConsent>
        </ClientOnly>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default function Root() {
  return <Outlet />;
}
