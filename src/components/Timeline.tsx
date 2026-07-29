import { Experience } from '../types'
import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from '../i18n/useTranslation'

type Props = {
  experiences: Experience[]
  selectedIndex: number | null
  onSelect: (index: number) => void
  onFilterChange: (filtered: Experience[]) => void
}

function parsePeriod(period: string): { start: Date; end: Date | null } {
  const parts = period.split(' - ')
  const startStr = parts[0].trim()
  const endStr = parts[1]?.trim()

  const parseDate = (str: string): Date => {
    if (str.toLowerCase() === 'today') return new Date()

    const monthMap: Record<string, number> = {
      jan: 0, january: 0, janvier: 0,
      feb: 1, february: 1, février: 1, fevrier: 1,
      mar: 2, march: 2, mars: 2,
      apr: 3, april: 3, avril: 3,
      may: 4, mai: 4,
      jun: 5, june: 5, juin: 5,
      jul: 6, july: 6, juillet: 6,
      aug: 7, august: 7, août: 7, aout: 7,
      sep: 8, sept: 8, september: 8, septembre: 8,
      oct: 9, october: 9, octobre: 9,
      nov: 10, november: 10, novembre: 10,
      dec: 11, december: 11, décembre: 11, decembre: 11
    }

    const tokens = str.split(' ')
    const year = parseInt(tokens[tokens.length - 1])
    const monthStr = tokens[0].toLowerCase()
    const month = monthMap[monthStr] ?? 0

    return new Date(year, month, 1)
  }

  const start = parseDate(startStr)
  const end = endStr ? parseDate(endStr) : null

  return { start, end }
}

function calculateMonths(period: string): number {
  const { start, end } = parsePeriod(period)
  const endDate = end || new Date()
  const months = (endDate.getFullYear() - start.getFullYear()) * 12 + (endDate.getMonth() - start.getMonth())
  return Math.max(1, months)
}

function doPeriodsOverlap(period1: string, period2: string): boolean {
  const { start: start1, end: end1 } = parsePeriod(period1)
  const { start: start2, end: end2 } = parsePeriod(period2)
  const end1Date = end1 || new Date()
  const end2Date = end2 || new Date()

  // Calculate month difference
  const start1Months = start1.getFullYear() * 12 + start1.getMonth()
  const end1Months = end1Date.getFullYear() * 12 + end1Date.getMonth()
  const start2Months = start2.getFullYear() * 12 + start2.getMonth()
  const end2Months = end2Date.getFullYear() * 12 + end2Date.getMonth()

  // Check if they overlap
  const overlaps = start1Months <= end2Months && start2Months <= end1Months

  // Exclude if they only touch at one month boundary
  const touchesAtBoundary = (start1Months === end2Months) || (start2Months === end1Months)
  const overlapMonths = Math.min(end1Months, end2Months) - Math.max(start1Months, start2Months)

  return overlaps && overlapMonths > 0
}

function assignLanes(experiences: Experience[]): Map<string, number> {
  const lanes = new Map<string, number>()
  const laneEndDates: (Date | null)[] = []

  experiences.forEach(exp => {
    const { start, end } = parsePeriod(exp.period)

    let assignedLane = -1
    for (let i = 0; i < laneEndDates.length; i++) {
      const laneEnd = laneEndDates[i]
      if (!laneEnd || laneEnd < start) {
        assignedLane = i
        break
      }
    }

    if (assignedLane === -1) {
      assignedLane = laneEndDates.length
      laneEndDates.push(end)
    } else {
      laneEndDates[assignedLane] = end
    }

    lanes.set(exp.id, assignedLane)
  })

  return lanes
}

export default function Timeline({ experiences, selectedIndex, onSelect, onFilterChange }: Props) {
  const { t } = useTranslation()
  const [typeFilter, setTypeFilter] = useState<'all' | 'work' | 'study'>('all')
  const [techFilters, setTechFilters] = useState<Set<string>>(new Set())

  const allTechs = useMemo(() => {
    const techs = new Set<string>()
    experiences.forEach(exp => exp.tech?.forEach(t => techs.add(t)))
    return Array.from(techs).sort()
  }, [experiences])

  const toggleTech = (tech: string) => {
    setTechFilters(prev => {
      const next = new Set(prev)
      if (next.has(tech)) {
        next.delete(tech)
      } else {
        next.add(tech)
      }
      return next
    })
  }

  const filtered = useMemo(() => {
    return experiences.filter(exp => {
      if (typeFilter !== 'all' && exp.type !== typeFilter) return false
      if (techFilters.size > 0) {
        const hasTech = exp.tech?.some(t => techFilters.has(t))
        if (!hasTech) return false
      }
      return true
    })
  }, [experiences, typeFilter, techFilters])

  const lanes = useMemo(() => assignLanes(filtered), [filtered])
  const maxLane = useMemo(() => Math.max(0, ...Array.from(lanes.values())), [lanes])

  const totalHeight = useMemo(() => {
    const minHeight = 60
    const heightPerMonth = 8
    const spacing = 8
    const total = filtered.reduce((sum, exp) => {
      const months = calculateMonths(exp.period)
      const blockHeight = Math.max(minHeight, months * heightPerMonth)
      return sum + blockHeight + spacing
    }, 0)
    return total + 200
  }, [filtered])

  useEffect(() => {
    onFilterChange(filtered)
  }, [filtered, onFilterChange])

  return (
    <div className="fixed right-4 top-8 bottom-8 w-72 overflow-hidden z-20">
      <div className="h-full bg-white/[0.02] backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden" style={{ backdropFilter: 'blur(40px) saturate(180%)' }}>
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-medium mb-3 text-white/90">{t('experience.filters')}</h3>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 text-xs rounded-full transition ${
                typeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {t('experience.all')}
            </button>
            <button
              onClick={() => setTypeFilter('work')}
              className={`px-3 py-1 text-xs rounded-full transition ${
                typeFilter === 'work' ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {t('experience.work')}
            </button>
            <button
              onClick={() => setTypeFilter('study')}
              className={`px-3 py-1 text-xs rounded-full transition ${
                typeFilter === 'study' ? 'bg-orange-500/30 text-orange-300' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {t('experience.study')}
            </button>
          </div>

          {allTechs.length > 0 && (
            <div>
              <div className="text-xs text-white/50 mb-2">{t('experience.technologies')}</div>

              {techFilters.size > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {Array.from(techFilters).map(tech => (
                    <div
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-white/20 text-white border border-white/30 rounded-full"
                    >
                      <span>{tech}</span>
                      <button
                        onClick={() => toggleTech(tech)}
                        className="hover:text-white/60 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <details className="group">
                <summary className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white/70 cursor-pointer hover:bg-white/10 transition list-none flex items-center justify-between">
                  <span>{techFilters.size > 0 ? `${techFilters.size} selected` : 'Select technologies'}</span>
                  <span className="text-white/40 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-2 max-h-40 overflow-y-auto bg-white/5 border border-white/10 rounded-lg p-2">
                  <div className="space-y-1">
                    {allTechs.map(tech => (
                      <label
                        key={tech}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer group/item"
                      >
                        <input
                          type="checkbox"
                          checked={techFilters.has(tech)}
                          onChange={() => toggleTech(tech)}
                          className="w-3 h-3 rounded border-white/30 bg-white/10 checked:bg-white/30"
                        />
                        <span className="text-xs text-white/70 group-hover/item:text-white/90">{tech}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>

        <div className="p-4 overflow-y-auto relative" style={{ maxHeight: 'calc(100% - 140px)' }}>
          {/* Single vertical line */}
          <div className="absolute left-8 top-0 w-px bg-white/20" style={{ height: `${totalHeight}px` }} />

          <div className="space-y-2 relative">
            {filtered.map((exp, idx) => {
              const originalIndex = experiences.indexOf(exp)
              const isSelected = selectedIndex === originalIndex
              const months = calculateMonths(exp.period)
              const minHeight = 60
              const heightPerMonth = 8
              const blockHeight = Math.max(minHeight, months * heightPerMonth)

              // Check overlaps with other filtered items
              const overlappingExps = filtered.filter((other, otherIdx) =>
                otherIdx !== idx && doPeriodsOverlap(exp.period, other.period)
              )
              const hasOverlap = overlappingExps.length > 0

              return (
              <button
                key={exp.id}
                onClick={() => onSelect(originalIndex)}
                className="w-full text-left transition-all group relative flex gap-4"
                style={{ minHeight: `${blockHeight}px` }}
              >
                {/* Timeline dot */}
                <div className="relative flex-shrink-0 pt-2">
                  <div
                    className={`w-3 h-3 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-white bg-white scale-125'
                        : exp.type === 'work'
                          ? 'border-blue-500 bg-blue-500/50 group-hover:bg-blue-500'
                          : 'border-orange-500 bg-orange-500/50 group-hover:bg-orange-500'
                    }`}
                  />
                  {isSelected && (
                    <div className={`absolute inset-0 rounded-full ${
                      exp.type === 'work' ? 'bg-blue-500' : 'bg-orange-500'
                    } animate-ping opacity-30`} />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-2 rounded-lg p-3 transition-all flex flex-col relative ${
                  isSelected
                    ? 'bg-white/20 border border-white/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/5'
                }`} style={{ minHeight: `${blockHeight - 8}px` }}>
                  {hasOverlap && (
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-yellow-500/40 rounded-full" />
                  )}
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-white/60 mb-1">{exp.period}</div>
                    {hasOverlap && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-500/30">
                        ⚡ Overlap
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-white mb-0.5">{exp.title}</div>
                  <div className="text-xs text-white/70">{exp.company}</div>
                  <div className="text-xs text-white/50">{exp.location}</div>
                  {hasOverlap && (
                    <div className="text-xs text-yellow-300/60 mt-2 border-t border-white/10 pt-2">
                      Concurrent: {overlappingExps.map(o => o.company).join(', ')}
                    </div>
                  )}
                  <div className="text-xs text-white/40 mt-auto pt-2">{months} month{months > 1 ? 's' : ''}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
    </div>
  )
}
