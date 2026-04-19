'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import MatrizEditToolbar from '@/components/demandas/matriz/MatrizEditToolbar'
import MatrizHeader from '@/components/demandas/matriz/MatrizHeader'
import MatrizInsights from '@/components/demandas/matriz/MatrizInsights'
import MatrizKpiBar from '@/components/demandas/matriz/MatrizKpiBar'
import MatrizSidePanel from '@/components/demandas/matriz/MatrizSidePanel'
import MatrizTable from '@/components/demandas/matriz/MatrizTable'
import { Toaster } from '@/components/ui/sonner'
import { matrizClients, matrizPlans, matrizYears } from '@/lib/matriz-mock-data'
import { deepCloneRows } from '@/lib/matriz-utils'
import type { Canal, CanalRow, MatrizDraft, MatrizPlan } from '@/types/matriz'

function buildInitialPlans(): MatrizPlan[] {
  return matrizPlans.flatMap((plan) =>
    matrizYears.map((year) => ({
      ...plan,
      id: `${plan.clientId}-${year}`,
      year,
      rows: deepCloneRows(plan.rows),
    }))
  )
}

function countChangedCells(baseRows: CanalRow[], draftRows: CanalRow[]): number {
  return draftRows.reduce((sum, draftRow) => {
    const baseRow = baseRows.find((row) => row.canal === draftRow.canal)
    if (!baseRow) return sum

    return (
      sum +
      draftRow.months.filter((month) => {
        const baseMonth = baseRow.months.find((entry) => entry.month === month.month)
        return baseMonth?.aprovado !== month.aprovado
      }).length
    )
  }, 0)
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export default function Page() {
  const [plans, setPlans] = useState<MatrizPlan[]>(() => buildInitialPlans())
  const [selectedClientId, setSelectedClientId] = useState<string>(matrizClients[0]?.id ?? '')
  const [selectedYear, setSelectedYear] = useState<number>(2025)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<MatrizDraft | null>(null)
  const [highlightedCanal, setHighlightedCanal] = useState<Canal | null>(null)
  const [changesCount, setChangesCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  const selectedPlan = useMemo(
    () =>
      plans.find((plan) => plan.clientId === selectedClientId && plan.year === selectedYear) ??
      plans.find((plan) => plan.clientId === selectedClientId) ??
      plans[0],
    [plans, selectedClientId, selectedYear]
  )

  useEffect(() => {
    if (!highlightedCanal) return
    const timeout = window.setTimeout(() => setHighlightedCanal(null), 2000)
    return () => window.clearTimeout(timeout)
  }, [highlightedCanal])

  function handleEditToggle() {
    if (!selectedPlan) return

    if (!isEditing) {
      const clonedRows = JSON.parse(JSON.stringify(selectedPlan.rows)) as CanalRow[]
      setDraft({ rows: clonedRows, isDirty: false })
      setChangesCount(0)
      setIsEditing(true)
      return
    }

    setDraft(null)
    setChangesCount(0)
    setIsEditing(false)
  }

  function handleCellChange(canal: Canal, month: number, value: number) {
    if (!draft || !selectedPlan) return

    const nextRows = deepCloneRows(draft.rows)
    const row = nextRows.find((entry) => entry.canal === canal)
    const targetMonth = row?.months.find((entry) => entry.month === month)

    if (!row || !targetMonth) return

    targetMonth.aprovado = value

    const nextChangesCount = countChangedCells(selectedPlan.rows, nextRows)
    setDraft({
      rows: nextRows,
      isDirty: nextChangesCount > 0,
    })
    setChangesCount(nextChangesCount)
  }

  async function handleSave() {
    if (!draft || !selectedPlan) return

    setIsSaving(true)
    await sleep(500)

    setPlans((current) =>
      current.map((plan) =>
        plan.id === selectedPlan.id
          ? {
              ...plan,
              rows: JSON.parse(JSON.stringify(draft.rows)) as CanalRow[],
              updatedAt: '2025-04-10',
              updatedBy: 'Ana Lima',
            }
          : plan
      )
    )

    setDraft(null)
    setIsEditing(false)
    setChangesCount(0)
    setIsSaving(false)
    toast.success('Matriz salva com sucesso')
  }

  function handleCancel() {
    setDraft(null)
    setIsEditing(false)
    setChangesCount(0)
  }

  function handleClientChange(clientId: string) {
    setSelectedClientId(clientId)
    setIsEditing(false)
    setDraft(null)
    setChangesCount(0)
  }

  function handleYearChange(year: number) {
    setSelectedYear(year)
    setIsEditing(false)
    setDraft(null)
    setChangesCount(0)
  }

  if (!selectedPlan) {
    return null
  }

  return (
    <div className="flex flex-col gap-6 p-6 pb-20">
      <Toaster />

      <MatrizHeader
        clients={matrizClients}
        selectedClientId={selectedClientId}
        onClientChange={handleClientChange}
        years={matrizYears}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
        updatedAt={selectedPlan.updatedAt}
        updatedBy={selectedPlan.updatedBy}
      />

      <MatrizKpiBar plan={draft ? { ...selectedPlan, rows: draft.rows } : selectedPlan} />

      <MatrizInsights plan={draft ? { ...selectedPlan, rows: draft.rows } : selectedPlan} onCanalHighlight={setHighlightedCanal} />

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1 overflow-hidden">
          <MatrizTable
            plan={selectedPlan}
            draft={draft}
            isEditing={isEditing}
            highlightedCanal={highlightedCanal}
            currentMonth={new Date().getMonth() + 1}
            onCellChange={handleCellChange}
          />
        </div>
        <MatrizSidePanel plan={draft ? { ...selectedPlan, rows: draft.rows } : selectedPlan} />
      </div>

      {isEditing && (
        <MatrizEditToolbar
          changesCount={changesCount}
          onCancel={handleCancel}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}
