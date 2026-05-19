import React, { useState } from 'react'
import { Upload, Download, FileDown, Send, UserCheck } from 'lucide-react'
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

  const handleDispatch = async () => {
    if (!selectedIds.length) return
    await dispatchMutation.mutateAsync(selectedIds)
    setSelectedIds([])
  }

  const handleBatchAssign = async () => {
    if (!selectedIds.length || !batchItcode.trim()) return
    await batchAssignMutation.mutateAsync({ ids: selectedIds, itcode: batchItcode.trim() })
    setSelectedIds([])
    setBatchItcode('')
    setShowBatchAssign(false)
  }

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
    const headers = ['招标类型', '信息提交时间', '战区', '省份', '城市', '主行业', '公告名称', '采购单位', '项目名称', '采购需求概况', '数量总计', '关键词', '预算金额（万元）', '预计采购开始时间', '预计采购截止时间', '采购人电话', '采购人联系人', '原始文章链接']
    const escapeCsv = (val: string) => val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val
    const sampleRow = ['意向招标', '2026-05-18', '广东', '广东', '广州', '医疗卫生', '医院信息化采购', '广州市第一人民医院', '智慧园区基础设施采购', '采购服务器及存储设备', '50', '医疗;IT;服务器', '500', '2026-06-01', '2026-06-30', '020-12345678', '张先生', 'https://example.com']
    const csvContent = headers.map(escapeCsv).join(',') + '\n' + sampleRow.map(escapeCsv).join(',')
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

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 bg-white border-b border-[var(--border-2)] flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-[var(--text-1)]">{user?.role === 'AR' ? '我的标讯' : '标讯管理'}</h1>
          <p className="text-xs text-[var(--text-3)] mt-0.5">
            {user?.role === 'AR' ? '查看分配给您的标讯并进行反馈' : user?.role === 'PRODUCT_MGR' ? '查看与您负责产品相关的标讯及销售跟进情况' : '查看、筛选和管理全部标讯'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === 'HQ_OPS' && (
            <>
              <Button variant="secondary" size="sm" onClick={handleDownloadTemplate} disabled={selectedIds.length > 0}>
                <FileDown size={14} />
                下载模板
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowUpload(true)} disabled={selectedIds.length > 0}>
                <Upload size={14} />
                上传标讯
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDispatch}
                loading={dispatchMutation.isPending}
                disabled={selectedIds.length === 0}
              >
                <Send size={14} />
                下发标讯{selectedIds.length > 0 && `(${selectedIds.length})`}
              </Button>
            </>
          )}
          {user?.role === 'SALES_ADMIN' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowBatchAssign(true)}
              disabled={selectedIds.length === 0}
            >
              <UserCheck size={14} />
              批量分配{selectedIds.length > 0 && `(${selectedIds.length})`}
            </Button>
          )}
          <Button size="sm" onClick={handleDownload} loading={exportMutation.isPending}>
            <Download size={14} />
            下载标讯
          </Button>
        </div>
      </div>
      <BidFilters onChange={setFilters} />
      <BidListTable
        filters={{
          ...filters,
          ...(user?.role === 'PRODUCT_MGR' ? { productManagerId: user.id } : {}),
        }}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {/* Upload Modal */}
      <Modal open={showUpload} onClose={closeUploadModal} title="上传标讯" width="max-w-xl">
        <div className="space-y-4">
          {uploadSuccess ? (
            <div className="flex flex-col items-center py-8 text-emerald-600">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div className="font-semibold text-lg">上传成功！</div>
              <div className="text-sm text-[var(--text-3)] mt-1">已导入 {uploadRows.length} 条标讯数据</div>
              <Button className="mt-5" variant="secondary" onClick={closeUploadModal}>
                关闭
              </Button>
            </div>
          ) : (
            <>
              <UploadDropzone onData={setUploadRows} />
              {uploadRows.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-[8px] border border-[var(--border-2)]">
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

      {/* Batch Assign Modal (SALES_ADMIN) */}
      <Modal
        open={showBatchAssign}
        onClose={() => { setShowBatchAssign(false); setBatchItcode('') }}
        title="批量分配标讯"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowBatchAssign(false); setBatchItcode('') }}>取消</Button>
            <Button onClick={handleBatchAssign} loading={batchAssignMutation.isPending} disabled={!batchItcode.trim()}>
              确认分配 {selectedIds.length} 条标讯
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-2)]">已选择 <span className="font-semibold text-[var(--text-1)]">{selectedIds.length}</span> 条标讯，请输入客户经理ITCode进行批量分配。</p>
          <div>
            <label className="block text-xs font-medium text-[var(--text-3)] mb-1">客户经理 ITCode</label>
            <input
              type="text"
              value={batchItcode}
              onChange={e => setBatchItcode(e.target.value)}
              placeholder="请输入ITCode..."
              className="w-full rounded-[6px] border border-[var(--border-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand-6)] focus:ring-1 focus:ring-[var(--brand-6)]"
            />
            <p className="text-xs text-[var(--text-3)] mt-1">请手工输入客户经理的ITCode</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
