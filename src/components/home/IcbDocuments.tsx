import { useState, useEffect } from 'react';
import { FileText, Download, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  fetchIcbDocuments,
  getDocumentDownloadUrl,
} from '@/services/postcodeService';
import type { IcbDocumentYear } from '@/services/postcodeService';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileExtension(name: string): string {
  const ext = name.split('.').pop()?.toUpperCase() || '';
  return ext;
}

interface IcbDocumentsProps {
  icbCode: string | null;
}

export function IcbDocuments({ icbCode }: IcbDocumentsProps) {
  const [documents, setDocuments] = useState<IcbDocumentYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!icbCode) {
      setDocuments([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchIcbDocuments(icbCode)
      .then((result) => {
        if (cancelled) return;
        const docs = result?.documents ?? [];
        setDocuments(docs);
        // Auto-expand the most recent year
        if (docs.length > 0) {
          setExpandedYears(new Set([docs[0].year]));
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError('Unable to load policy documents.');
        if (import.meta.env.DEV) console.error('[IcbDocuments]', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [icbCode]);

  if (!icbCode) return null;
  if (loading) {
    return (
      <Card className="border-none shadow-md rounded-xl bg-cream p-6">
        <div className="flex items-center gap-2 text-sm text-deep-slate/70">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading policy documents…
        </div>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="border-none shadow-md rounded-xl bg-cream p-6">
        <div className="text-sm text-red-600">{error}</div>
      </Card>
    );
  }
  if (documents.length === 0) return null;

  function toggleYear(year: string) {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  }

  return (
    <Card className="border-none shadow-md rounded-xl bg-cream p-6">
      <CardTitle className="text-deep-slate font-bold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-sage-dark" />
        ICB Policy Documents
      </CardTitle>

      <div className="space-y-3">
        {documents.map(({ year, files }) => {
          const isExpanded = expandedYears.has(year);
          return (
            <div key={year} className="rounded-lg border border-warm-sand-dark overflow-hidden">
              <button
                type="button"
                onClick={() => toggleYear(year)}
                className="w-full flex items-center justify-between px-4 py-3 bg-warm-sand hover:bg-warm-sand-dark transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-green focus-visible:ring-offset-1"
                aria-expanded={isExpanded}
              >
                <span className="flex items-center gap-2">
                  {isExpanded
                    ? <ChevronDown className="w-4 h-4 text-sage-dark" />
                    : <ChevronRight className="w-4 h-4 text-sage-dark" />
                  }
                  <span className="font-semibold text-sm text-deep-slate">{year}</span>
                </span>
                <Badge variant="outline" className="text-xs">
                  {files.length} {files.length === 1 ? 'document' : 'documents'}
                </Badge>
              </button>

              {isExpanded && (
                <div className="divide-y divide-warm-sand-dark/50">
                  {files.map((file) => (
                    <a
                      key={file.key}
                      href={getDocumentDownloadUrl(file.key)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-warm-sand transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-green focus-visible:ring-offset-1"
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-sage-light flex items-center justify-center">
                        <FileText className="w-4 h-4 text-sage-dark" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-deep-slate truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-deep-slate/60">
                          {fileExtension(file.name)} · {formatFileSize(file.size)}
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-deep-slate/40 group-hover:text-sage-dark transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
