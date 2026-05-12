import type { ReactNode } from "react";
import { Fragment } from "react";
import { Link } from "react-router";

export type BreadcrumbParent = { label: string; to: string };

type PageHeaderProps = {
  title: string;
  description?: string;
  /** Last crumb (current page), not linked */
  breadcrumbCurrent: string;
  /** Optional middle crumbs between Home and the current page */
  breadcrumbParents?: BreadcrumbParent[];
  actions?: ReactNode;
};

export function PageHeader({
  title,
  description,
  breadcrumbCurrent,
  breadcrumbParents,
  actions,
}: PageHeaderProps) {
  return (
    <header className="border-b border-warm-sand-dark/50 bg-gradient-to-b from-paper to-warm-bg/40">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-deep-slate/55">
            <li>
              <Link
                to="/"
                className="font-medium transition-colors hover:text-route-teal-dark"
              >
                Home
              </Link>
            </li>
            {breadcrumbParents?.map((p) => (
              <Fragment key={`${p.to}-${p.label}`}>
                <li aria-hidden="true" className="text-deep-slate/35">
                  /
                </li>
                <li>
                  <Link
                    to={p.to}
                    className="font-medium transition-colors hover:text-route-teal-dark"
                  >
                    {p.label}
                  </Link>
                </li>
              </Fragment>
            ))}
            <li aria-hidden="true" className="text-deep-slate/35">
              /
            </li>
            <li className="font-medium text-deep-slate">{breadcrumbCurrent}</li>
          </ol>
        </nav>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-deep-slate sm:text-4xl md:text-[2.5rem] md:leading-[1.15]">
              {title}
            </h1>
            {description ? (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-deep-slate/75 md:text-[1.05rem]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}
