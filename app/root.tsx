import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction } from "react-router";
import type { Route } from "./+types/root";
import { type ReactNode } from "react";
import { Navbar } from "./components/layout/Navbar";
import { SiteFooter } from "./components/layout/SiteFooter";
import { RouteErrorBoundary } from "./components/errors/RouteErrorBoundary";
import "./index.css";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
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
        <script defer src="https://cloud.umami.is/script.js" data-website-id="44f8082d-d6af-4d34-b0d6-ee6791fc5a30" data-domains="postcodetoparenthood.org.uk,www.postcodetoparenthood.org.uk" />
      </head>
      <body>
        <div className="min-h-screen bg-page font-sans selection:bg-warm selection:text-ink flex flex-col">
          <Navbar />
          <main className="relative flex flex-1 flex-col pt-16 md:pt-20">{children}</main>
          <SiteFooter />
        </div>
        <ScrollRestoration />
        <Scripts />
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
