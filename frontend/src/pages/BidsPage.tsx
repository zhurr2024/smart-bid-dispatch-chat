import React, { useState } from 'react'
import { Upload, Download, FileDown, Send, Users } from 'lucide-react'
import { BidFilters } from '@/components/bid/BidFilters'
import { BidListTable } from '@/components/bid/BidListTable'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { UploadDropzone } from '@/components/upload/UploadDropzone'
import { UploadPreview } from '@/components/upload/UploadPreview'
import { useAuthStore } from '@/stores/authStore'
import { useExportBids, useDispatchBids, useBatchAssignBids } from '@/hooks/useBids'
import { BidQuery } from '@/services/bidService'

export default function BidsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [showUpload, setShowUpload] = useState(false)
  const [uploadRows, setUploadRows] = useState<Record<string, any>[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showBatchAssign, setShowBatchAssign] = useState(false)
  const [batchItcode, setBatchItcode] = useState('')
  const user = useAuthStore(s => s.user)
  const exportMutation = useExportBids()
  const dispatchMutation = useDispatchBids()
  const batchAssignMutation = useBatchAssignBids()

  const handleUpload = async () => {
    if (!uploadRows.length) return
    setUploading(true)
    await new Promise(r => setTimeout(r, 1200))
    setUploadSuccess(true)
    setUploading(false)
  }

  const handleDownload = () => {
    exportMutation.mutate(filters as BidQuery)
  }

  const handleDownloadTemplate = () => {
    const headers = ['标讯编号', '标讯类型', '招标类型', '项目名称', '采购单位', '项目地点', '战区', '主行业', '预算金额', '发布时间', '截止时间', '项目概述', '关键词', '信息来源']
    const csvContent = headers.join(',') + '\n' +
      ['ISG-2024-0001', 'ISG', '意向招标', '示例项目', '示例采购方', '广东省广州市', '广东', '政府', '500', '2024-03-01', '2024-03-15', '项目概述示例', '医疗,IT', '政府采购网'].join(',')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '标讯上传模板.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const closeUploadModal = () => {
    setShowUpload(false)
    setUploadRows([])
    setUploadSuccess(false)
  }

  const handleDispatch = () => {
    if (selectedIds.length === 0) return
    dispatchMutation.mutate(selectedIds, {
      onSuccess: () => setSelectedIds([]),
    })
  }

  const handleBatchAssign = () => {
    if (selectedIds.length === 0 || !batchItcode.trim()) return
    batchAssignMutation.mutate(
      { ids: selectedIds, itcode: batchItcode.trim() },
      {
        onSuccess: () => {
          setSelectedIds([])
          setBatchItcode('')
          setShowBatchAssign(false)
        },
      }
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-slate-900">标讯管理</h1>
          <p className="text-xs text-slate-500 mt-0.5">查看、筛选和管理全部标讯</p>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === 'HQ_OPS' && (
            <>
              <Button variant="secondary" size="sm" onClick={handleDownloadTemplate}>
                <FileDown size={14} />
                下载模板
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowUpload(true)}>
                <Upload size={14} />
                上传标讯
              </Button>
              <Button size="sm" onClick={handleDispatch} loading={dispatchMutation.isPending} disabled={selectedIds.length === 0}>
                <Send size={14} />
                下发标讯{selectedIds.length > 0 && ` (${selectedIds.length})`}
              </Button>
            </>
          )}
          {user?.role === 'SALES_ADMIN' && (
            <Button size="sm" onClick={() => setShowBatchAssign(true)} disabled={selectedIds.length === 0}>
              <Users size={14} />
              批量分配{selectedIds.length > 0 && ` (${selectedIds.length})`}
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={handleDownload} loading={exportMutation.isPending}>
            <Download size={14} />
            下载标讯
          </Button>
        </div>
      </div>
      <BidFilters onChange={setFilters} />
      <BidListTable filters={filters} selectedIds={selectedIds} onSelectionChange={setSelectedIds} />

      {/* Batch Assign Modal */}
      <Modal open={showBatchAssign} onClose={() => { setShowBatchAssign(false); setBatchItcode('') }} title="批量分配标讯" footer={
        <>
          <Button variant="secondary" onClick={() => { setShowBatchAssign(false); setBatchItcode('') }}>取消</Button>
          <Button onClick={handleBatchAssign} loading={batchAssignMutation.isPending} disabled={!batchItcode.trim()}>
            确认分配 ({selectedIds.length} 条)
          </Button>
        </>
      }>
        <div className="space-y-4">
          <div className="text-sm text-slate-600">
            已选择 <span className="font-semibold text-indigo-700">{selectedIds.length}</span> 条标讯，请输入客户经理ITCode进行分配。
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">客户经理 ITCode</label>
            <input
              type="text"
              value={batchItcode}
              onChange={e => setBatchItcode(e.target.value)}
              placeholder="请输入ITCode..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </Modal>

      {/* Upload Modal */}
      <Modal open={showUpload} onClose={closeUploadModal} title="上传标讯" width="max-w-xl">
        <div className="space-y-4">
          {uploadSuccess ? (
            <div className="flex flex-col items-center py-8 text-emerald-600">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div className="font-semibold text-lg">上传成功！</div>
              <div className="text-sm text-slate-500 mt-1">已导入 {uploadRows.length} 条标讯数据</div>
              <Button className="mt-5" variant="secondary" onClick={closeUploadModal}>
                关闭
              </Button>
            </div>
          ) : (
            <>
              <UploadDropzone onData={setUploadRows} />
              {uploadRows.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200">
                  <UploadPreview rows={uploadRows} />
                </div>
              )}
              {uploadRows.length > 0 && (
                <div className="flex justify-end pt-2">
                  <Button onClick={handleUpload} loading={uploading}>
                    确认上传 {uploadRows.length} 条标讯
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
