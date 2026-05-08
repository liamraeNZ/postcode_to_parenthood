import { Link } from 'react-router';
import { toSlug } from '../../lib/slug';

export interface BorderContextPanelProps {
  currentBoard: { id: string; name: string; cyclesOffered: number | null };
  neighbours: Array<{ id: string; name: string; cyclesOffered: number | null; slug: string | null }>;
  loading: boolean;
}

/**
 * Determines whether a neighbouring board offers more cycles than the current board.
 * Returns true if neighbourCycles is non-null AND neighbourCycles > (currentCycles ?? 0).
 */
function isImprovement(currentCycles: number | null, neighbourCycles: number | null): boolean {
  if (neighbourCycles === null) return false;
  return neighbourCycles > (currentCycles ?? 0);
}

/**
 * Determines whether a neighbouring board offers fewer cycles than the current board.
 * Returns true if neighbourCycles is non-null AND neighbourCycles < (currentCycles ?? 0).
 */
function isWorse(currentCycles: number | null, neighbourCycles: number | null): boolean {
  if (neighbourCycles === null) return false;
  return neighbourCycles < (currentCycles ?? 0);
}

function formatCycles(cycles: number | null): string {
  if (cycles === null) return 'No data';
  if (cycles === 0) return '0 cycles';
  if (cycles === 1) return '1 cycle';
  return `${cycles} cycles`;
}

/**
 * BorderContextPanel displays a comparison between the user's current health board
 * and visible neighbouring boards, highlighting any that offer more IVF cycles.
 */
export function BorderContextPanel({ currentBoard, neighbours, loading }: BorderContextPanelProps) {
  if (loading) {
    return (
      <div
        className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-warm-sand-dark"
        role="region"
        aria-label="Neighbouring board comparison"
      >
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-3/4 rounded bg-warm-sand" />
          <div className="h-3 w-1/2 rounded bg-warm-sand" />
          <div className="h-3 w-2/3 rounded bg-warm-sand" />
        </div>
      </div>
    );
  }

  const hasImprovement = neighbours.some((n) => isImprovement(currentBoard.cyclesOffered, n.cyclesOffered));

  return (
    <div
      className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-warm-sand-dark"
      role="region"
      aria-label="Neighbouring board comparison"
    >
      {/* Current board */}
      <div className="mb-3">
        <h4 className="font-heading text-xs font-semibold uppercase tracking-wide text-deep-slate/60">
          Your board
        </h4>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-deep-slate">{currentBoard.name}</span>
          <span className="shrink-0 rounded-full bg-warm-sand px-2 py-0.5 text-xs font-medium text-deep-slate">
            {formatCycles(currentBoard.cyclesOffered)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-warm-sand-dark" />

      {/* Neighbours */}
      <div className="mt-3">
        <h4 className="font-heading text-xs font-semibold uppercase tracking-wide text-deep-slate/60">
          Neighbouring boards
        </h4>

        {neighbours.length === 0 ? (
          <p className="mt-2 text-xs text-deep-slate/60">No neighbouring boards visible</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {neighbours.map((neighbour) => {
              const improved = isImprovement(currentBoard.cyclesOffered, neighbour.cyclesOffered);
              const worse = isWorse(currentBoard.cyclesOffered, neighbour.cyclesOffered);
              return (
                <li key={neighbour.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {neighbour.slug ? (
                      <Link
                        to={`/board/${toSlug(neighbour.slug)}`}
                        className="text-sm font-medium text-sage-dark hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-green"
                      >
                        {neighbour.name}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-deep-slate">{neighbour.name}</span>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      improved
                        ? 'bg-[#D1FAE5] text-[#065F46]'
                        : worse
                          ? 'bg-[#FEE2E2] text-[#991B1B]'
                          : 'bg-warm-sand text-deep-slate'
                    }`}
                  >
                    {improved && (
                      <span className="mr-0.5" aria-hidden="true">↑</span>
                    )}
                    {worse && (
                      <span className="mr-0.5" aria-hidden="true">↓</span>
                    )}
                    {formatCycles(neighbour.cyclesOffered)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Summary message when no neighbour offers more */}
        {neighbours.length > 0 && !hasImprovement && (
          <p className="mt-3 text-xs text-deep-slate/60">
            Your board matches or exceeds neighbouring provision
          </p>
        )}
      </div>
    </div>
  );
}
