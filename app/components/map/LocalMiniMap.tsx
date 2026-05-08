import React, { Suspense, useState, useEffect } from 'react';
import { useGeocodePostcode } from '../../hooks/useGeocodePostcode';

const LazyMiniMapContent = React.lazy(() => import('./MiniMapContent'));

export interface LocalMiniMapProps {
  gpPostcode: string;
  currentBoardId: string;
  currentBoardName: string;
}

// --- Client-Only wrapper (prevents SSR issues with Leaflet) ---

function ClientOnly({
  children,
  fallback,
}: {
  children: () => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children() : fallback}</>;
}

// --- Error Boundary (renders nothing on failure) ---

interface ErrorBoundaryState {
  hasError: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class MiniMapErrorBoundary extends (React.Component as any)<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[LocalMiniMap] Render error:', error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

// --- Main orchestrator component ---

export function LocalMiniMap({ gpPostcode, currentBoardId, currentBoardName }: LocalMiniMapProps) {
  const { data, loading, error } = useGeocodePostcode(gpPostcode);

  // While loading, render nothing to avoid layout shift
  if (loading) {
    return null;
  }

  // Silent failure: error or no data
  if (error || data === null) {
    return null;
  }

  // England-only scope
  if (data.country !== 'England') {
    return null;
  }

  const position: [number, number] = [data.latitude, data.longitude];

  return (
    <MiniMapErrorBoundary>
      <ClientOnly fallback={null}>
        {() => (
          <Suspense fallback={null}>
            <LazyMiniMapContent
              position={position}
              gpPostcode={gpPostcode}
              currentBoardId={currentBoardId}
              currentBoardName={currentBoardName}
            />
          </Suspense>
        )}
      </ClientOnly>
    </MiniMapErrorBoundary>
  );
}
