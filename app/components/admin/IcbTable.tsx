import { useState } from 'react'
import { AdminIcb } from '@/types/admin'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface IcbTableProps {
  icbs: AdminIcb[]
  onSelect: (icb: AdminIcb) => void
  onEdit: (icb: AdminIcb) => void
  onToggleStatus: (icb: AdminIcb) => void
}

type StatusFilter = 'all' | 'active' | 'inactive'

export function IcbTable({ icbs, onSelect, onEdit, onToggleStatus }: IcbTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = icbs.filter((icb) => {
    const matchesSearch = icb.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || icb.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Search by name..."
          aria-label="Search ICBs by name"
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Active Policy</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((icb) => (
            <TableRow key={icb.id}>
              <TableCell>{icb.name}</TableCell>
              <TableCell>{icb.region ?? '—'}</TableCell>
              <TableCell>
                <Badge variant={icb.status === 'active' ? 'default' : 'outline'}>
                  {icb.status}
                </Badge>
              </TableCell>
              <TableCell>{icb.has_active_policy ? '✓' : '—'}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => onSelect(icb)}>
                    Select
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEdit(icb)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onToggleStatus(icb)}>
                    {icb.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                No ICBs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
