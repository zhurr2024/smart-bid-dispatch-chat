import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileSpreadsheet, X } from 'lucide-react'
import readXlsxFile, { readSheet } from 'read-excel-file/browser'
import { Button } from '@/components/ui/Button'

interface UploadDropzoneProps {
  onData: (rows: Record<string, any>[]) => void
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onData }) => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0]
    if (!f) return
    setFile(f)
    setError('')

    readSheet(f).then((rows) => {
      const headers = rows[0].map(String)
      const data = rows.slice(1).map((row) => {
        const obj: Record<string, any> = {}
        headers.forEach((h, i) => { obj[h] = row[i] ?? '' })
        return obj
      })
      onData(data)
    }).catch(() => {
      setError('文件解析失败，请确认是否为有效的 Excel 文件')
    })
  }, [onData])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] },
    maxFiles: 1,
  })

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={40} className={`mx-auto mb-3 ${isDragActive ? 'text-indigo-500' : 'text-slate-400'}`} />
        <div className="font-medium text-slate-700 mb-1">
          {isDragActive ? '松开上传文件' : '拖放 Excel 文件到此处'}
        </div>
        <div className="text-sm text-slate-500">或点击选择文件 · 支持 .xlsx / .xls 格式</div>
      </div>

      {file && (
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <FileSpreadsheet size={20} className="text-emerald-600" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">{file.name}</div>
            <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</div>
          </div>
          <button onClick={() => { setFile(null); onData([]) }} className="text-slate-400 hover:text-red-500 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {error && <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
    </div>
  )
}
