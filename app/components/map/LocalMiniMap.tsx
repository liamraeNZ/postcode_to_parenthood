import React, { Suspense, useState, useEffect } from 'react';
import { useGeocodePostcode } from '../../hooks/useGeocodePostcode';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';

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
    <ErrorBoundary
      fallback={null}
      onError={(error) => console.error('[LocalMiniMap] Render error:', error)}
    >
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
    </ErrorBoundary>
  );
}
