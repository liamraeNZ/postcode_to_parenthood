import { useRouteError, isRouteErrorResponse, Link } from "react-router";

interface Props {
  resourceName?: string;
  backTo?: string;
  backLabel?: string;
}

export function RouteErrorBoundary({ resourceName, backTo = "/", backLabel = "Back to home" }: Props) {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  const heading = is404 ? "Page not found" : "Something went wrong";
  const message = is404
    ? resourceName
      ? `We couldn't find that ${resourceName}. It may have been moved or removed.`
      : "The page you're looking for doesn't exist or has been moved."
    : "An unexpected error occurred. Please try again later.";

  return (
    <div className="container mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-heading text-3xl font-semibold text-ink">{heading}</h1>
      <p className="mt-4 font-sans text-ink/70">{message}</p>
      <Link to={backTo} className="mt-8 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white">
        {backLabel}
      </Link>
    </div>
  );
}
