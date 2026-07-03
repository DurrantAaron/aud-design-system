import React, { useMemo, useState } from 'react'
import { AudInput } from './AudInput'
import { EmptyState } from './EmptyState'
import { AudSkeleton } from './AudSkeleton'

const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"

export interface AudColumn {
  /** Lookup key into each row record. */
  key: string
  /** Header cell content. */
  header: React.ReactNode
  /** Cell + header text alignment. Defaults to `left`. */
  align?: 'left' | 'right' | 'center'
  /** Fixed column width (px number or any CSS width). */
  width?: number | string
}

export interface AudTableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  columns: AudColumn[]
  rows: Array<Record<string, React.ReactNode>>
  /** Stable row id. Defaults to the row index. */
  rowKey?: (row: Record<string, React.ReactNode>, i: number) => string
  /** Show the toolbar search field (filters on stringified cell values). */
  searchable?: boolean
  /** Swap the body for shimmer rows. */
  loading?: boolean
  /** Replaces the default {@link EmptyState} when there are no rows. */
  emptyState?: React.ReactNode
  onRowClick?: (row: Record<string, React.ReactNode>) => void
  /** Adds a checkbox column + the selection → bulk-actions bar. */
  selectable?: boolean
  /** Controlled selection (row keys). */
  selectedKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
  /** Actions revealed in the contextual bar when rows are selected. */
  bulkActions?: React.ReactNode
  /** Right-aligned toolbar slot (filters, "New", export, …). */
  toolbar?: React.ReactNode
}

// Pull a plain string out of a cell value for search + checkbox a11y labels.
function cellText(value: React.ReactNode): string {
  if (value == null || value === false || value === true) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(cellText).join(' ')
  if (React.isValidElement(value)) return cellText((value.props as { children?: React.ReactNode }).children)
  return ''
}

/**
 * The dashboard table SHELL: data + the controls a real table always grows.
 * Composes {@link AudInput} (toolbar search), {@link AudSkeleton} (loading) and
 * {@link EmptyState} (no rows). Two patterns are baked in:
 *
 *  - **table = data + controls** — a toolbar row carries search on the left and
 *    a free `toolbar` slot (filters / "New" / export) on the right.
 *  - **selection reveals bulk actions** — when `selectable` and a row is picked,
 *    the toolbar is *replaced* by a contextual bar: the selected count + your
 *    `bulkActions` slot.
 *
 * Header is `--aud-mid` small-caps, rows are separated by `--aud-rule`
 * hairlines, and clickable rows tint with `--aud-overlay-hover`. SSR-safe
 * (search/hover are component state, no global CSS) and inline-styled.
 *
 * ```tsx
 * <AudTable
 *   searchable
 *   columns={[{ key: 'name', header: 'Venue' }, { key: 'score', header: 'Score', align: 'right' }]}
 *   rows={[{ name: 'Demo Venue', score: 92 }]}
 *   onRowClick={open}
 *   toolbar={<AudButton>New audit</AudButton>}
 * />
 *
 * <AudTable
 *   selectable
 *   selectedKeys={sel}
 *   onSelectionChange={setSel}
 *   bulkActions={<AudButton variant="danger">Delete</AudButton>}
 *   columns={cols}
 *   rows={rows}
 * />
 * ```
 */
export function AudTable({
  columns,
  rows,
  rowKey,
  searchable = false,
  loading = false,
  emptyState,
  onRowClick,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  bulkActions,
  toolbar,
  style,
  ...rest
}: AudTableProps) {
  const [query, setQuery] = useState('')
  const [hoverKey, setHoverKey] = useState<string | null>(null)

  // Tag every row with its stable key + original index up front, so filtering
  // and select-all never have to re-derive identity (and duplicate row objects
  // don't collide on indexOf).
  const keyed = useMemo(
    () => rows.map((row, i) => ({ row, key: rowKey ? rowKey(row, i) : String(i) })),
    [rows, rowKey],
  )

  // Filter on the stringified cell values, case-insensitive.
  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return keyed
    const q = query.trim().toLowerCase()
    return keyed.filter(({ row }) =>
      columns.some((col) => cellText(row[col.key]).toLowerCase().includes(q)),
    )
  }, [keyed, columns, query, searchable])

  const selected = new Set(selectedKeys)
  const hasSelection = selectable && selected.size > 0

  const toggleRow = (key: string) => {
    if (!onSelectionChange) return
    const next = new Set(selected)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onSelectionChange(Array.from(next))
  }

  // Visible (post-filter) keys, for the header select-all checkbox.
  const visibleKeys = filtered.map(({ key }) => key)
  const allSelected = visibleKeys.length > 0 && visibleKeys.every((k) => selected.has(k))
  const toggleAll = () => {
    if (!onSelectionChange) return
    if (allSelected) {
      onSelectionChange(selectedKeys.filter((k) => !visibleKeys.includes(k)))
    } else {
      onSelectionChange(Array.from(new Set([...selectedKeys, ...visibleKeys])))
    }
  }

  const colCount = columns.length + (selectable ? 1 : 0)

  const cellPad = '10px 12px'
  const hairline = '1px solid var(--aud-rule, #D8D4CC)'

  const headerCellStyle = (align?: AudColumn['align']): React.CSSProperties => ({
    padding: cellPad,
    textAlign: align ?? 'left',
    fontSize: 'var(--aud-text-xs, 0.6875rem)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--aud-mid, #6B6960)',
    whiteSpace: 'nowrap',
  })

  const showToolbar = searchable || toolbar != null || (selectable && hasSelection)

  return (
    <div
      style={{
        width: '100%',
        fontFamily: BODY_FONT,
        color: 'var(--aud-ink, #14130F)',
        background: 'var(--aud-surface, #FAFAF8)',
        border: hairline,
        borderRadius: 'var(--aud-radius, 4px)',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      {showToolbar && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            borderBottom: hairline,
            // The contextual bar tints the strip so the mode switch reads.
            background: hasSelection ? 'var(--aud-surface-tint, #FAFAF8)' : 'transparent',
            minHeight: 56,
            boxSizing: 'border-box',
          }}
        >
          {hasSelection ? (
            <>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {selected.size} selected
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                {bulkActions}
              </div>
            </>
          ) : (
            <>
              {searchable && (
                <div style={{ flex: '0 1 280px' }}>
                  <AudInput
                    type="search"
                    placeholder="Search…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    leadingIcon={<SearchIcon />}
                    aria-label="Search table"
                  />
                </div>
              )}
              {toolbar != null && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                  {toolbar}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr style={{ borderBottom: hairline }}>
              {selectable && (
                <th style={{ ...headerCellStyle('center'), width: 44 }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                    style={{ accentColor: 'var(--aud-accent, #C8A84B)', cursor: 'pointer' }}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} style={{ ...headerCellStyle(col.align), width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`} style={{ borderBottom: hairline }}>
                  {selectable && (
                    <td style={{ padding: cellPad }}>
                      <AudSkeleton variant="block" width={16} height={16} />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: cellPad }}>
                      <AudSkeleton variant="text" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={colCount} style={{ padding: 0 }}>
                  {emptyState ?? (
                    query.trim() ? (
                      <EmptyState
                        variant="no-results"
                        title="No matching rows"
                        description={`Nothing matches “${query.trim()}”.`}
                        secondaryAction={{ label: 'Clear search', onClick: () => setQuery('') }}
                      />
                    ) : (
                      <EmptyState variant="first-run" title="Nothing here yet" />
                    )
                  )}
                </td>
              </tr>
            ) : (
              filtered.map(({ row, key: k }) => {
                const isSel = selected.has(k)
                const clickable = !!onRowClick
                return (
                  <tr
                    key={k}
                    onClick={clickable ? () => onRowClick!(row) : undefined}
                    onMouseEnter={clickable ? () => setHoverKey(k) : undefined}
                    onMouseLeave={clickable ? () => setHoverKey(null) : undefined}
                    style={{
                      borderBottom: hairline,
                      cursor: clickable ? 'pointer' : 'default',
                      background: isSel
                        ? 'var(--aud-overlay-hover, rgba(20,19,15,0.06))'
                        : clickable && hoverKey === k
                          ? 'var(--aud-overlay-hover, rgba(20,19,15,0.06))'
                          : 'transparent',
                      transition: 'background var(--aud-duration-fast, 120ms) var(--aud-ease-snap, cubic-bezier(0.2,0,0,1))',
                    }}
                  >
                    {selectable && (
                      <td
                        style={{ padding: cellPad, textAlign: 'center', width: 44 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleRow(k)}
                          aria-label={`Select ${cellText(row[columns[0]?.key]) || 'row'}`}
                          style={{ accentColor: 'var(--aud-accent, #C8A84B)', cursor: 'pointer' }}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{
                          padding: cellPad,
                          textAlign: col.align ?? 'left',
                          color: 'var(--aud-ink, #14130F)',
                          verticalAlign: 'middle',
                        }}
                      >
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default AudTable
