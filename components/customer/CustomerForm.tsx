import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label }     from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import FileUpload from '@/components/customer/FileUpload';
import FileCard from '@/components/customer/FileCard';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import { DatePicker as RawDatePicker, DatePickerProps } from '@/components/ui/datePicker';
import { FileOrder } from '@/types/order';
const DatePicker = RawDatePicker as React.ComponentType<DatePickerProps>

type Props = {
    formRef: React.RefObject<HTMLDivElement | null>;
    name: string;
    setName: (v: string) => void;
    email: string;
    setEmail: (v: string) => void;
    branch: string;
    setBranch: (v: string) => void;
    pickupDate: Date | undefined;
    setPickupDate: (v: Date | undefined) => void;

    files: FileOrder[];
    isDragging: boolean;
    setIsDragging: (v: boolean) => void;
    addFiles: (files: FileList | null) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;

    isValid: boolean;
    removeFile: (id: string) => void;
    updateFile: <K extends keyof FileOrder>(
        id: string,
        field: K,
        value: FileOrder[K]
    ) => void;
    setShowReview: (v: boolean) => void;
};

export default function CustomerForm({
    formRef,
    name,
    setName,
    email,
    setEmail,
    branch,
    setBranch,
    pickupDate,
    setPickupDate,

    files,
    isDragging,
    setIsDragging,
    addFiles,
    onDrop,

    removeFile,
    updateFile,
    setShowReview,
    isValid
}: Props) {
    const fileInput = useRef<HTMLInputElement>(null);

    return(
        <div ref={formRef} className="w-full flex justify-center px-4 py-14 bg-white">
        <div className="w-full max-w-xl flex flex-col gap-8">

          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">
              Place Your Order
            </span>
            <h2 className="text-zinc-900 text-3xl font-extrabold">What do you need printed?</h2>
            <p className="text-zinc-400 text-sm mt-2">Each file can have its own print settings.</p>
          </div>

          <Card className="border border-zinc-200 shadow-sm">
            <CardContent className="p-6 sm:p-8 flex flex-col gap-6">

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Full Name <span className="text-orange-500">*</span>
                  </Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Juan dela Cruz" className="border-zinc-200 focus-visible:ring-orange-400" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Email <span className="text-orange-500">*</span>
                  </Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type='email'
                    placeholder="youremail@gmail.com" className="border-zinc-200 focus-visible:ring-orange-400" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Branch <span className="text-orange-500">*</span>
                  </Label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="h-9 w-full rounded-3xl border border-zinc-200 focus-visible:ring-orange-400 bg-input/50 px-3 text-sm transition-[color,box-shadow,background-color] focus:ring-3 focus:ring-ring/30 focus:border-ring">
                      <SelectValue placeholder="Select branch…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="branch1">Western</SelectItem>
                      <SelectItem value="branch2">EVSU Outside</SelectItem>
                      <SelectItem value="branch3">EVSU Inside</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Preferred Pick-up Date
                  </Label>
                  <DatePicker value={pickupDate} onChange={setPickupDate} />
                </div>
              </div>

              <Separator />

            {/* Drop zone */}
            <FileUpload
                files={files}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                addFiles={addFiles}
                onDrop={onDrop}
                fileInput={fileInput}
            />

            {/* ── Per-file cards ── */}
            {files.length > 0 && (
                <div className="flex flex-col gap-4">
                    <p className="text-xs font-bold text-zinc-400">
                    Print Settings — {files.length} files
                    </p>

                    {files.map((file, index) => (
                    <FileCard
                        key={file.id}
                        file={file}
                        index={index}
                        removeFile={removeFile}
                        updateFile={updateFile}
                    />
                    ))}
                </div>
            )}

            <Separator />

              {/* Submit */}
              <Button onClick={() => setShowReview(true)}
                className="w-full py-6 text-base font-bold cursor-pointer bg-orange-500 hover:bg-orange-400 text-white shadow-md shadow-orange-200 disabled:opacity-40"
                disabled={!isValid}>
                Review Order
              </Button>
              <p className="text-center text-zinc-400 text-xs">
                You&apos;ll receive the total cost via email after we review your order.
              </p>

            </CardContent>
          </Card>
        </div>
      </div>
    )
}