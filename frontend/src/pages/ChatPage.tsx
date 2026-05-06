import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, FileSpreadsheet, Download, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Bid } from '@/types'
import { useBids } from '@/hooks/useBids'
import { useAssignBid } from '@/hooks/useBids'
import { BidTypeBadge, TenderTypeBadge } from '@/components/bid/BidTypeBadge'
import { PriorityBadge } from '@/components/bid/PriorityBadge'
import { useUiStore } from '@/stores/uiStore'
import clsx from 'clsx'

interface ChatMsg {
  id: string
  role: 'user' | 'ai'
  content: string
  file?: { name: string; size: number }
  bids?: Bid[]
  suggestions?: string[]
  downloadLink?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: '您好！我是标讯智能助手。您可以：\n• 将 Excel 附件发给我，说"帮我上传标讯"\n• 输入"查询我的标讯"来查看和管理标讯\n• 输入"下载标讯"来导出数据',
      suggestions: ['帮我上传标讯', '查询待下发的标讯', '下载标讯'],
    },
  ])
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: pendingBids } = useBids({ status: 'PENDING', pageSize: 50 })
  const { data: allBids } = useBids({ pageSize: 50 })
  const assignBid = useAssignBid()
  const setSelectedBidId = useUiStore(s => s.setSelectedBidId)

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const addMsg = (msg: Omit<ChatMsg, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: `msg-${Date.now()}-${Math.random()}` }])
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text && !file) return

    // Add user message
    addMsg({
      role: 'user',
      content: text || (file ? `上传文件：${file.name}` : ''),
      file: file ? { name: file.name, size: file.size } : undefined,
    })
    setInput('')
    setProcessing(true)

    // Simulate AI processing
    await new Promise(r => setTimeout(r, 1200))

    if (file && /上传|导入/.test(text)) {
      // Upload scenario
      const rowCount = Math.floor(Math.random() * 20) + 5
      const hasError = Math.random() > 0.7 // 30% chance of partial failure

      if (hasError) {
        const errorCount = Math.floor(Math.random() * 3) + 1
        addMsg({
          role: 'ai',
          content: `上传完成！成功导入 ${rowCount - errorCount} 条标讯，${errorCount} 条失败。\n\n失败原因已整理到文件中，请下载查看。`,
          downloadLink: '上传失败明细.xlsx',
          suggestions: ['查询待下发的标讯'],
        })
      } else {
        addMsg({
          role: 'ai',
          content: `✅ 上传成功！共导入 ${rowCount} 条标讯数据。\n\n系统已自动完成：\n• 标讯分级（高/中/低优先级）\n• 战区匹配\n• 招标类型识别`,
          suggestions: ['查询待下发的标讯', '继续上传'],
        })
      }
      setFile(null)
    } else if (/查询|我的标讯|待下发|待分配/.test(text)) {
      // Query scenario
      const bidList = /待下发|待分配/.test(text) ? (pendingBids?.data || []) : (allBids?.data?.slice(0, 8) || [])
      addMsg({
        role: 'ai',
        content: `找到 ${bidList.length} 条标讯：`,
        bids: bidList,
        suggestions: ['下载标讯', '查询高优先级标讯'],
      })
    } else if (/下载|导出/.test(text)) {
      // Download scenario
      addMsg({
        role: 'ai',
        content: '已为您生成标讯数据文件，点击下方按钮下载。',
        downloadLink: `标讯数据_${new Date().toISOString().slice(0, 10)}.xlsx`,
        suggestions: ['查询我的标讯', '帮我上传标讯'],
      })
    } else {
      addMsg({
        role: 'ai',
        content: '我理解了您的需求。请问您想要：',
        suggestions: ['帮我上传标讯', '查询我的标讯', '下载标讯'],
      })
    }

    setProcessing(false)
  }

  const handleSuggestion = (text: string) => {
    setInput(text)
    setTimeout(() => {
      setInput(text)
      handleSendWithText(text)
    }, 100)
  }

  const handleSendWithText = async (text: string) => {
    addMsg({ role: 'user', content: text })
    setProcessing(true)
    await new Promise(r => setTimeout(r, 1000))

    if (/待下发|待分配/.test(text)) {
      const bidList = pendingBids?.data || []
      addMsg({
        role: 'ai',
        content: `找到 ${bidList.length} 条待下发标讯：`,
        bids: bidList,
        suggestions: ['下载标讯'],
      })
    } else if (/下载|导出/.test(text)) {
      addMsg({
        role: 'ai',
        content: '已为您生成标讯数据文件，点击下方按钮下载。',
        downloadLink: `标讯数据_${new Date().toISOString().slice(0, 10)}.xlsx`,
      })
    } else if (/上传/.test(text)) {
      addMsg({
        role: 'ai',
        content: '请将 Excel 文件拖入下方输入框或点击附件按钮选择文件，然后发送。',
      })
    } else if (/高优/.test(text)) {
      const highBids = allBids?.data?.filter(b => b.priority === 'HIGH') || []
      addMsg({
        role: 'ai',
        content: `找到 ${highBids.length} 条高优先级标讯：`,
        bids: highBids,
        suggestions: ['下载标讯'],
      })
    } else {
      addMsg({
        role: 'ai',
        content: '请问您想要：',
        suggestions: ['帮我上传标讯', '查询我的标讯', '下载标讯'],
      })
    }
    setProcessing(false)
  }

  const handleDownload = () => {
    const headers = ['标讯编号', '标讯类型', '项目名称', '采购单位', '战区', '状态']
    const csv = '\uFEFF' + headers.join(',') + '\n'
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `标讯数据_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDispatch = async (bidId: string, userId: string) => {
    await assignBid.mutateAsync({ id: bidId, userId })
    addMsg({ role: 'ai', content: `✅ 标讯已成功下发。`, suggestions: ['查询待下发的标讯'] })
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
        <h1 className="font-semibold text-slate-900">智能问答</h1>
        <p className="text-xs text-slate-500 mt-0.5">通过对话管理标讯：上传、查询、下载</p>
      </div>

      {/* Message Feed */}
      <div ref={feedRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={clsx(
              'max-w-[75%] rounded-xl px-4 py-3 text-sm',
              msg.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
            )}>
              {/* File attachment indicator */}
              {msg.file && (
                <div className="flex items-center gap-2 mb-2 bg-white/10 rounded px-2 py-1.5">
                  <FileSpreadsheet size={16} />
                  <span className="text-xs">{msg.file.name}</span>
                </div>
              )}

              {/* Message content */}
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Inline bid list */}
              {msg.bids && msg.bids.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.bids.map(bid => (
                    <div
                      key={bid.id}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => setSelectedBidId(bid.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <BidTypeBadge bidType={bid.bidType} />
                        <PriorityBadge priority={bid.priority} />
                        <span className="text-xs text-slate-500">{bid.region}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-900 truncate">{bid.projectName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{bid.purchaserName} · {bid.budget ? `${bid.budget}万` : '预算待定'}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Download link */}
              {msg.downloadLink && (
                <button
                  onClick={handleDownload}
                  className="mt-3 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-xs font-medium cursor-pointer"
                >
                  <Download size={14} />
                  {msg.downloadLink}
                </button>
              )}

              {/* Suggestion chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1 hover:bg-indigo-100 cursor-pointer transition-colors flex items-center gap-1"
                    >
                      {s}
                      <ChevronRight size={12} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {processing && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 bg-white px-6 py-4">
        {file && (
          <div className="flex items-center gap-2 mb-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <FileSpreadsheet size={16} className="text-emerald-600" />
            <span className="text-xs text-slate-700 flex-1">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 text-xs cursor-pointer">移除</button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
            title="上传附件"
          >
            <Paperclip size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) setFile(f)
              e.target.value = ''
            }}
          />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="输入消息，或拖入 Excel 文件..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
            onDrop={e => {
              e.preventDefault()
              const f = e.dataTransfer.files?.[0]
              if (f && /\.(xlsx|xls|csv)$/i.test(f.name)) setFile(f)
            }}
            onDragOver={e => e.preventDefault()}
          />
          <Button onClick={handleSend} disabled={processing && !input && !file} size="sm">
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
