import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileOrder } from '@/types/order';
import React from 'react';

type Props = {
    open: boolean; 
    setOpen: (v: boolean) => void;
    name: string;
    email: string;
    pickupDate: Date | undefined;
    files: FileOrder[];
    onConfirm: () => Promise<void>;
};

function Detail({ label, value, className }: { label: string; value: string; className?: string }) {
    return (
      <div className={className}>
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-xs font-semibold text-zinc-700 capitalize">{value}</p>
      </div>
    )
  }

export default function ReviewModal({
    open,
    setOpen,
    name,
    email,
    pickupDate,
    files,
    onConfirm,
}: Props)
{    
    const [loading, setLoading] = React.useState(false)
    
    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-xl font-extrabold text-zinc-900">Order Summary</DialogTitle>
                <DialogDescription className="text-zinc-500 text-sm">
                Please review your order before confirming.
                </DialogDescription>
            </DialogHeader>

            {/* Customer Info */}
            <div className="flex flex-col gap-1 bg-zinc-50 rounded-xl px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Customer</p>
                <p className="text-sm font-semibold text-zinc-800">{name}</p>
                <p className="text-xs text-zinc-500">{email}</p>
                {pickupDate && (
                    <p className="text-xs text-zinc-500">
                        Pick-up: {pickupDate.toLocaleString('en-PH', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: 'numeric', minute: '2-digit', hour12: true,
                        })}
                    </p>
                )}s
            </div>

            {/* Per-file summary */}
            <div className="flex flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Files — {files.length} item{files.length > 1 ? 's' : ''}
                </p>

                {files.map((f, idx) => (
                <div key={f.file_id} className="border border-zinc-200 rounded-xl overflow-hidden">
                    {/* File name header */}
                    <div className="flex items-center gap-2 bg-zinc-50 border-b border-zinc-200 px-3 py-2">
                    <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-xs font-bold text-zinc-700 truncate flex-1">
                        <span className="text-orange-500 mr-1">#{idx + 1}</span>{f.file.name}
                    </p>
                    {/* <span className="text-xs font-bold text-orange-500 flex-shrink-0">
                        ₱{fileSubtotal(f).toFixed(2)}
                    </span> */}
                    </div>

                    {/* File details */}
                    <div className="px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1">
                    <Detail label="Service" value={f.service.replace('print-', 'Print & ').replace('print-only', 'Print Only')} />
                    <Detail label="Copies" value={String(f.copies)} />
                    <Detail label="Color" value={f.color_mode === 'black-and-white' ? 'B&W' : 'Colored'} />
                    <Detail label="Paper Size" value={f.paper_size} />
                    {f.softbound_color && <Detail label="Softbound Color" value={f.softbound_color} className="col-span-2" />}
                    {f.notes && <Detail label="Notes" value={f.notes} className="col-span-2" />}
                    
                    </div>
                </div>
                ))}
            </div>

            <Separator />

            <Button
                disabled={loading}
                onClick={async () => {
                try {
                    setLoading(true)
                    await onConfirm()
                    setOpen(false)
                } finally {
                    setLoading(false)
                }
                }}
                className="w-full py-5 font-bold cursor-pointer text-base bg-orange-500 hover:bg-orange-400 text-white mt-1"
            >
                {loading ? "Processing..." : "Confirm Order →"}
            </Button>
            </DialogContent>
        </Dialog>
    )
}