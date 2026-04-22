'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileOrder } from '@/types/order'
import { getFileDownloadUrl, getFileViewUrl } from '@/lib/supabase/orders'
import { SERVICE_LABEL, SIZE_LABEL } from '@/lib/formatters'
import { Download, FileText, Printer } from 'lucide-react'

interface FileRowProps {
  file: FileOrder
  orderId: string
}

export function FileRow({ file }: FileRowProps) {
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    const url = await getFileDownloadUrl(file.file_path)
    if (url) {
      const a = document.createElement('a')
      a.href = url
      a.download = file.file_path.split('/').pop() ?? 'file'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
    setDownloading(false)
  }

  async function handlePrint() {
    const url = getFileViewUrl(file.file_path)
    const printWindow = window.open(url, '_blank')
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
      }
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-4 rounded-xl bg-zinc-50 border border-zinc-100">
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-orange-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-800 truncate">{file.file_path.split('/').pop()}</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">{SERVICE_LABEL[file.service]}</span>
            <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">{file.copies}x copy</span>
            <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">{SIZE_LABEL[file.paper_size]}</span>
            <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full capitalize">{file.color_mode.replace('-', ' ')}</span>
            {file.softbound_color && (
              <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full capitalize">{file.softbound_color} cover</span>
            )}
          </div>
          {file.notes && (
            <p className="text-xs text-zinc-400 mt-1 italic">&quot;{file.notes}&quot;</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button size="sm" variant="outline"
          className="h-8 gap-1.5 text-xs border-zinc-200 text-zinc-600 hover:text-zinc-900"
          disabled={downloading}
          onClick={handleDownload}>
          <Download className="w-3.5 h-3.5" />
          {downloading ? 'Getting link…' : 'Download'}
        </Button>
        <Button size="sm"
          className="h-8 gap-1.5 text-xs bg-orange-500 hover:bg-orange-400 text-white"
          onClick={handlePrint}>
          <Printer className="w-3.5 h-3.5" /> Print
        </Button>
      </div>
    </div>
  )
}