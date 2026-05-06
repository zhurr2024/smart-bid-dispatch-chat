import React from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

const REQUIRED_FIELDS = ['项目名称', '采购单位', '项目地点', '大区', '标讯类型', '招标类型', '项目概述', '发布时间']

interface UploadPreviewProps {
  rows: Record<string, any>[]
}

export const UploadPreview: React.FC<UploadPreviewProps> = ({ rows }) => {
  if (!rows.length) return null

  const headers = Object.keys(rows[0])
  const missingRequired = REQUIRED_FIELDS.filter(f => !headers.includes(f))

  const getRowErrors = (row: Record<string, any>) =>
    REQUIRED_FIELDS.filter(f => headers.includes(f) && !row[f])

  const errorRows = rows.filter(r => getRowErrors(r).length > 0).length
  const validRows = rows.length - errorRows

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-emerald-700">
          <CheckCircle2 size={15} />
          <span>有效行：{validRows}</span>
        </div>
        {errorRows > 0 && (
          <div className="flex items-center gap-1.5 text-red-600">
            <AlertCircle size={15} />
            <span>异常行：{errorRows}（红色高亮）</span>
          </div>
        )}
        {missingRequired.length > 0 && (
          <div className="text-amber-600 text-xs">
            缺少列：{missingRequired.join('、')}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-auto max-h-80">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-50">
              <tr>
                <th className="text-left px-3 py-2 text-slate-500 font-medium border-b border-slate-200 whitespace-nowrap">#</th>
                {headers.map(h => (
                  <th key={h} className={clsx(
                    'text-left px-3 py-2 font-medium border-b border-slate-200 whitespace-nowrap',
                    REQUIRED_FIELDS.includes(h) ? 'text-slate-900' : 'text-slate-500'
                  )}>
                    {h}
                    {REQUIRED_FIELDS.includes(h) && <span className="text-red-500 ml-0.5">*</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((row, i) => {
                const errs = getRowErrors(row)
                const hasError = errs.length > 0
                return (
                  <tr key={i} className={clsx(hasError ? 'bg-red-50' : 'hover:bg-slate-50')}>
                    <td className="px-3 py-2 text-slate-400 border-b border-slate-100">{i + 1}</td>
                    {headers.map(h => (
                      <td key={h} className={clsx(
                        'px-3 py-2 border-b border-slate-100 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis',
                        hasError && errs.includes(h) ? 'text-red-600 font-medium' : 'text-slate-700'
                      )}>
                        {String(row[h] ?? '')}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
          {rows.length > 50 && (
            <div className="text-center py-2 text-xs text-slate-400 bg-slate-50 border-t border-slate-200">
              仅显示前 50 行，共 {rows.length} 行
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
