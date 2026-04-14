import { ColorMode, SoftboundColor, PaperSize, Service, FileOrder } from '@/types/order';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    file: FileOrder;
    index: number;
    removeFile: (id: string) => void;
    updateFile: <K extends keyof FileOrder>(
        id: string,
        field: K,
        value: FileOrder[K]
    ) => void;
};

export default function FileCard({
    file,
    index,
    removeFile,
    updateFile,
}: Props) {
    return(
        <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            {/* File header */}
            <div className="flex items-center gap-3 bg-zinc-50 border-b border-zinc-200 px-4 py-3">
            <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-700 truncate">
                    <span className="text-orange-500 mr-1">#{index + 1}</span>{file.file.name}
                    </p>
                    <p className="text-xs text-zinc-400">{(file.file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => removeFile(file.file_id)} className="cursor-pointer text-zinc-300 hover:text-red-400 transition-colors shrink-0 ml-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* File settings body */}
            <div className="p-4 flex flex-col gap-3 bg-white">

            {/* Doc type */}
            <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Service Chosen <span className="text-orange-500">*</span>
                </Label>
                <Select value={file.service} onValueChange={(v) => {
                    updateFile(file.file_id, 'service', v as Service)
                    if (v !== 'print-softbound') {
                        updateFile(file.file_id, 'softbound_color', null)
                    }
                }}>
                <SelectTrigger className="h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm transition-[color,box-shadow,background-color] focus:ring-3 focus:ring-ring/30 focus:border-ring">
                    <SelectValue placeholder="Select service…" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="print-only">Print Only</SelectItem>
                    <SelectItem value="print-softbound">Print & Softbound</SelectItem>
                    <SelectItem value="print-laminate">Print & Laminate</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Pages + Copies */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Copies <span className="text-orange-500">*</span>
                </Label>
                <Input type="number" min={1}
                    value={file.copies} onChange={(e) => updateFile(file.file_id, 'copies', Number(e.target.value))}
                    className="border-zinc-200 focus-visible:ring-orange-400 h-9 text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Paper Size</Label>
                <Select value={file.paper_size} onValueChange={(v) => updateFile(file.file_id, 'paper_size', v as PaperSize)}>
                    <SelectTrigger className="border-zinc-200 focus:ring-orange-400 h-9 text-xs">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="A4">A4</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>

            {/* Color + Softbound Color */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Color</Label>
                <Select value={file.color_mode} onValueChange={(v) => updateFile(file.file_id, 'color_mode', v as ColorMode)}>
                    <SelectTrigger className="border-zinc-200 focus:ring-orange-400 h-9 text-xs">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="colored">Colored — ₱5-20/pg</SelectItem>
                    <SelectItem value="black-and-white">Black & White — ₱3/pg</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                {(file.service === 'print-softbound') && (
                <div className="flex flex-col gap-1">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Softbound Color</Label>
                    <Select value={file.softbound_color ?? ''} onValueChange={(v) => updateFile(file.file_id, 'softbound_color', v as SoftboundColor)}>                                
                    <SelectTrigger className="border-zinc-200 focus:ring-orange-400 h-9 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                )}
            </div>

            {/* Per-file notes */}
            <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Notes for this file</Label>
                <Textarea value={file.notes} onChange={(e) => updateFile(file.file_id, 'notes', e.target.value)}
                placeholder="Double-sided? Specific pages only?" rows={2}
                className="border-zinc-200 focus-visible:ring-orange-400 resize-none text-sm" />
            </div>
            </div>
        </div>
    );
}