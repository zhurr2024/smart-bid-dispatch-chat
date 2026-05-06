import React, { useState } from 'react'
import { UploadDropzone } from '@/components/upload/UploadDropzone'
import { UploadPreview } from '@/components/upload/UploadPreview'
import { Button } from '@/components/ui/Button'
import { Download, CheckCircle2 } from 'lucide-react'

export default function UploadPage() {
  const [rows, setRows] = useState<Record<string, any>[]>([])
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleUpload = async () => {
    if (!rows.length) return
    setUploading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSuccess(true)
    setUploading(false)
  }

  const handleDownloadTemplate = () => {
    const headers = ['标讯编号', '标讯类型', '招标类型', '项目名称', '采购单位', '项目地点', '大区', '预算金额', '发布时间', '截止时间', '项目概述', '关键词', '信息来源']
    const csvContent = headers.join(',') + '\n' +
      ['ISG-2024-0001', 'ISG', '意向招标', '示例项目', '示例采购方', '广东省广州市', '华南', '500', '2024-03-01', '2024-03-15', '项目概述示例', '医疗,IT', '政府采购网'].join(',')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '标讯上传模板.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-semibold text-slate-900 text-lg">标讯上传</h1>
          <p className="text-sm text-slate-500 mt-0.5">上传 Excel 格式的标讯数据，系统将自动解析和分级</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleDownloadTemplate}>
          <Download size={14} />
          下载模板
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        {success ? (
          <div className="flex flex-col items-center py-12 text-emerald-600">
            <CheckCircle2 size={48} className="mb-3" />
            <div className="font-semibold text-lg">上传成功！</div>
            <div className="text-sm text-slate-500 mt-1">已导入 {rows.length} 条标讯数据</div>
            <Button className="mt-6" variant="secondary" onClick={() => { setSuccess(false); setRows([]) }}>
              继续上传
            </Button>
          </div>
        ) : (
          <>
            <UploadDropzone onData={setRows} />
            <UploadPreview rows={rows} />
            {rows.length > 0 && (
              <div className="flex justify-end">
                <Button onClick={handleUpload} loading={uploading}>
                  确认上传 {rows.length} 条标讯
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
