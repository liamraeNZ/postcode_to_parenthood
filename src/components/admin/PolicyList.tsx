import { AdminPolicy } from '../../types/admin'
import { isActivePolicy } from '../../utils/adminValidation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface PolicyListProps {
  icbId: string
  policies: AdminPolicy[]
  onNewPolicy: () => void
}

function formatDate(date: string | null): string {
  return date ?? '—'
}

export function PolicyList({ icbId: _icbId, policies, onNewPolicy }: PolicyListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Policies</h3>
        <Button size="sm" onClick={onNewPolicy}>
          New Policy Version
        </Button>
      </div>

      {policies.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">No policies yet</p>
      ) : (
        <div className="space-y-2">
          {policies.map((policy) => {
            const active = isActivePolicy(policy)
            return (
              <div
                key={policy.id}
                className="rounded-lg border p-4 space-y-2 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    From {formatDate(policy.effective_from)}
                    {policy.effective_to ? ` to ${policy.effective_to}` : ''}
                  </span>
                  <Badge variant={active ? 'default' : 'outline'}>
                    {active ? 'Active' : 'Historical'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                  <span>Cycles offered: {policy.cycles_offered}</span>
                  <span>Max age: {policy.max_age}</span>
                  <span>BMI min: {policy.bmi_min ?? '—'}</span>
                  <span>BMI max: {policy.bmi_max ?? '—'}</span>
                  <span>IUI rounds required: {policy.iui_rounds_required}</span>
                  <span>Living children rule: {policy.living_children_rule ?? '—'}</span>
                  {policy.source_url && (
                    <span className="col-span-2">
                      Source:{' '}
                      <a
                        href={policy.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-green focus-visible:ring-offset-1 rounded-sm"
                      >
                        {policy.source_url}
                      </a>
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
