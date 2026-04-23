import { useState } from 'react'
import { AdminIcb, AdminPolicy } from '../../types/admin'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PolicyList } from './PolicyList'

interface IcbTableProps {
  icbs: AdminIcb[]
  onEdit: (icb: AdminIcb) => void
  onToggleStatus: (icb: AdminIcb) => void
  onLoadPolicies: (icb: AdminIcb) => Promise<AdminPolicy[]>
  onNewPolicy: (icb: AdminIcb) => void
}

type StatusFilter = 'all' | 'active' | 'inactive'

export function IcbTable({ icbs, onEdit, onToggleStatus, onLoadPolicies, onNewPolicy }: IcbTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // Policy modal state
  const [policyIcb, setPolicyIcb] = useState<AdminIcb | null>(null)
  const [policies, setPolicies] = useState<AdminPolicy[]>([])
  const [policyLoading, setPolicyLoading] = useState(false)

  const filtered = icbs.filter((icb) => {
    const matchesSearch = icb.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || icb.status === statusFilter
    return matchesSearch && matchesStatus
  })

  async function openPolicyModal(icb: AdminIcb) {
    setPolicyIcb(icb)
    setPolicyLoading(true)
    try {
      const data = await onLoadPolicies(icb)
      setPolicies(data)
    } finally {
      setPolicyLoading(false)
    }
  }

  function closePolicyModal() {
    setPolicyIcb(null)
    setPolicies([])
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-1">
          {(['all', 'active', 'inactive'] as StatusFilter[]).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-auto">Name</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="w-28">Active Policy</TableHead>
            <TableHead className="w-40">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((icb) => (
            <TableRow key={icb.id}>
              <TableCell className="truncate max-w-0">{icb.name}</TableCell>
              <TableCell>
                <Badge variant={icb.status === 'active' ? 'default' : 'outline'}>
                  {icb.status}
                </Badge>
              </TableCell>
              <TableCell>{icb.has_active_policy ? '✓' : '—'}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => onEdit(icb)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openPolicyModal(icb)}>
                    Policy
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                No ICBs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={!!policyIcb} onOpenChange={(open) => { if (!open) closePolicyModal() }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{policyIcb?.name} — Policies</DialogTitle>
          </DialogHeader>
          {policyLoading ? (
            <p className="text-sm text-muted-foreground py-4">Loading…</p>
          ) : policyIcb ? (
            <PolicyList
              icbId={policyIcb.id}
              policies={policies}
              onNewPolicy={() => {
                closePolicyModal()
                onNewPolicy(policyIcb)
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
