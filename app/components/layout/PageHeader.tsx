import type { ReactNode } from "react";
import { Fragment } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

export type BreadcrumbParent = { label: string; to: string };

type PageHeaderProps = {
  title: string;
  description?: string;
  /** Last crumb (current page), not linked */
  breadcrumbCurrent: string;
  /** Optional middle crumbs between Home and the current page */
  breadcrumbParents?: BreadcrumbParent[];
  actions?: ReactNode;
  /** Tighter vertical spacing when the page has large content directly below (e.g. map) */
  compact?: boolean;
  /** Optional content rendered below the title/description within the header */
  children?: ReactNode;
};

export function PageHeader({
  title,
  description,
  breadcrumbCurrent,
  breadcrumbParents,
  actions,
  compact,
  children,
}: PageHeaderProps) {
  return (
    <header className="border-b border-tint/15 bg-gradient-to-b from-surface to-surface-dark/40">
      <div
        className={cn(
          "container mx-auto px-4",
          compact ? "py-5 md:py-6" : "py-8 md:py-10"
        )}
      >
        <nav
          aria-label="Breadcrumb"
          className={cn(compact ? "mb-3" : "mb-5")}
        >
          <ol className="flex flex-wrap items-center gap-2 font-sans text-sm text-ink/55">
            <li>
              <Link
                to="/"
                className="font-medium transition-colors hover:text-tint"
              >
                Home
              </Link>
            </li>
            {breadcrumbParents?.map((p) => (
              <Fragment key={`${p.to}-${p.label}`}>
                <li aria-hidden="true" className="text-ink/35">
                  /
                </li>
                <li>
                  <Link
                    to={p.to}
                    className="font-medium transition-colors hover:text-tint"
                  >
                    {p.label}
                  </Link>
                </li>
              </Fragment>
            ))}
            <li aria-hidden="true" className="text-ink/35">
              /
            </li>
            <li className="font-medium text-ink">{breadcrumbCurrent}</li>
          </ol>
        </nav>
        <div
          className={cn(
            "flex flex-col lg:flex-row lg:items-end lg:justify-between",
            compact ? "gap-4" : "gap-6"
          )}
        >
          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-brand sm:text-4xl md:text-[2.5rem] md:leading-[1.15]">
              {title}
            </h1>
            {description ? (
              <p
                className={cn(
                  "max-w-2xl font-sans text-base leading-relaxed text-ink/75 md:text-[1.05rem]",
                  compact ? "mt-2" : "mt-3"
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
        {children ? <div className={cn(compact ? "mt-3" : "mt-4")}>{children}</div> : null}
      </div>
    </header>
  );
}
