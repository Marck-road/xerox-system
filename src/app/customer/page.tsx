'use client';

import Image from 'next/image';
import { useState, useRef, useCallback, SetStateAction } from 'react';

import { Button }    from '@/components/ui/button';
import { Input }     from '@/components/ui/input';
import { Label }     from '@/components/ui/label';
import { Textarea }  from '@/components/ui/textarea';
import { Badge }     from '@/components/ui/badge';
import { DatePicker as RawDatePicker, DatePickerProps } from '@/components/ui/datePicker';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

const DatePicker = RawDatePicker as React.ComponentType<DatePickerProps>

// ── Types ─────────────────────────────────────────────────
type ColorMode = 'black-and-white' | 'colored';
type SoftboundColor = 'yellow' | 'red' | 'blue' | 'orange' | 'green';
type PaperSize = 'A4' | 'short' | 'long';
type Service = 'print-only' | 'print-softbound' | 'print-laminate';
type PaymentMethod = 'pickup' | 'gcash';

interface FileOrder {
  id: string;
  file: File;
  pages: string;
  copies: string;
  colorMode: ColorMode;
  paperSize: PaperSize;
  softboundColor: SoftboundColor;
  service: Service;
  notes: string;
}

// ── Main component ────────────────────────────────────────
export default function CustomerPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined)
  const [files, setFiles] = useState<FileOrder[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // ── File management ───────────────────────────────────
  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next: FileOrder[] = Array.from(list).map((file) => ({
      id: crypto.randomUUID(),
      file,
      pages: '', copies: '1',
      colorMode: 'black-and-white',
      paperSize: 'A4', softboundColor: 'yellow',
      service: 'print-only', notes: '',
    }));
    setFiles((prev) => [...prev, ...next]);
  };

  const removeFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const updateFile = <K extends keyof FileOrder>(id: string, key: K, val: FileOrder[K]) =>
    setFiles((prev) => prev.map((f) => f.id === id ? { ...f, [key]: val } : f));

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  // ── Validation ────────────────────────────────────────
  const isValid =
    name.trim() !== '' &&
    email.trim() !== '' &&
    files.length > 0 &&
    files.every((f) => f.service && parseInt(f.pages) > 0 && parseInt(f.copies) > 0);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleConfirmPayment = () => {
    if (!paymentMethod) return;
    setShowPayment(false);
    setSubmitted(true);
  };

  const resetAll = () => {
    setName(''); setEmail(''); setFiles([]);
    setPaymentMethod(null); setSubmitted(false);
  };

  // ── Success screen ────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center">
          <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-900">Order Submitted!</h2>
          <p className="text-zinc-500 text-sm mt-1 max-w-xs">
            Thanks <span className="text-orange-500 font-semibold">{name}</span>! We&apos;ll reach you at{' '}
            <span className="font-semibold">{email}</span> once your order is ready.
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-6 py-4 text-sm text-zinc-700 w-full max-w-xs">
          <p>Payment: <span className="font-bold text-orange-500">{paymentMethod === 'gcash' ? 'GCash' : 'Pay upon pick-up'}</span></p>
          <p className="mt-1">Files: <span className="font-bold">{files.length}</span></p>
        </div>
        <Button variant="outline" onClick={resetAll}>Submit another order</Button>
      </div>
    );
  }

  // ── Main page ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className="relative w-full" style={{ aspectRatio: '16/7' }}>
        <Image src="/CoverPicture.png" alt="Connections Copier" fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-white" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <Badge className="bg-orange-500 hover:bg-orange-500 text-white text-xs tracking-widest uppercase px-3 py-1">
            Fast · Affordable · Reliable
          </Badge>
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
            Print. Copy. Done.
          </h1>
          <p className="text-zinc-100 text-sm sm:text-base max-w-sm drop-shadow">
            Fill out your order below — no account needed!
          </p>
          <button onClick={scrollToForm} className="mt-1 flex flex-col items-center gap-1 text-orange-300 hover:text-orange-200 transition-colors">
            <span className="text-xs font-bold tracking-widest uppercase">Order Now</span>
            <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Form ── */}
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
                  <Select value={branch} onValueChange={(v: SetStateAction<string>) => setBranch(v)}>
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
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Upload Files <span className="text-orange-500">*</span>
                  </p>
                  <input
                    ref={fileInput}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files)}
                  />

                  {files.length === 0 ? (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={onDrop}
                      onClick={() => fileInput.current?.click()}
                      className={`cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 text-center transition-colors
                        ${isDragging ? 'border-orange-400 bg-orange-50' : 'border-zinc-200 hover:border-orange-300 hover:bg-orange-50/40'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-zinc-700">Click to upload or drag & drop</p>
                      <p className="text-xs text-zinc-400">PDF, DOCX, JPG, PNG — multiple files OK</p>
                    </div>
                  ) : (
                    /* Compact strip — when files exist */
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={onDrop}
                      onClick={() => fileInput.current?.click()}
                      className={`cursor-pointer border-2 border-dashed rounded-xl px-4 py-3 flex items-center gap-3 transition-colors
                        ${isDragging ? 'border-orange-400 bg-orange-50' : 'border-zinc-200 hover:border-orange-300 hover:bg-orange-50/40'}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-700">Drop more files or click to browse</p>
                        <p className="text-xs text-zinc-400">{files.length} file{files.length > 1 ? 's' : ''} added so far</p>
                      </div>
                      <span className="text-xs font-bold text-orange-500 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full shrink-0">
                        + Add
                      </span>
                    </div>
                  )}
                </div>

              {/* ── Per-file cards ── */}
              {files.length > 0 && (
                <div className="flex flex-col gap-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Print Settings — {files.length} file{files.length > 1 ? 's' : ''}
                  </p>

                  {files.map((f, idx) => (
                    <div key={f.id} className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm">

                      {/* File header */}
                      <div className="flex items-center gap-3 bg-zinc-50 border-b border-zinc-200 px-4 py-3">
                        <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-zinc-700 truncate">
                            <span className="text-orange-500 mr-1">#{idx + 1}</span>{f.file.name}
                          </p>
                          <p className="text-xs text-zinc-400">{(f.file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button onClick={() => removeFile(f.id)} className="text-zinc-300 hover:text-red-400 transition-colors shrink-0 ml-1">
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
                          <Select value={f.service} onValueChange={(v) => updateFile(f.id, 'service', v as Service)}>
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
                              No. of Pages <span className="text-orange-500">*</span>
                            </Label>
                            <Input type="number" min={1} placeholder="e.g. 10"
                              value={f.pages} onChange={(e) => updateFile(f.id, 'pages', e.target.value)}
                              className="border-zinc-200 focus-visible:ring-orange-400 h-9 text-sm" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                              Copies <span className="text-orange-500">*</span>
                            </Label>
                            <Input type="number" min={1}
                              value={f.copies} onChange={(e) => updateFile(f.id, 'copies', e.target.value)}
                              className="border-zinc-200 focus-visible:ring-orange-400 h-9 text-sm" />
                          </div>
                        </div>

                        {/* Color + Paper + Binding */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Color</Label>
                            <Select value={f.colorMode} onValueChange={(v) => updateFile(f.id, 'colorMode', v as ColorMode)}>
                              <SelectTrigger className="border-zinc-200 focus:ring-orange-400 h-9 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="black-and-white">B&W — ₱3/pg</SelectItem>
                                <SelectItem value="colored">Color — ₱10/pg</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Paper</Label>
                            <Select value={f.paperSize} onValueChange={(v) => updateFile(f.id, 'paperSize', v as PaperSize)}>
                              <SelectTrigger className="border-zinc-200 focus:ring-orange-400 h-9 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A4">A4</SelectItem>
                                <SelectItem value="short">Short</SelectItem>
                                <SelectItem value="long">Long</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {(f.service === 'print-softbound') && (
                            <div className="flex flex-col gap-1">
                              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Softbound Color</Label>
                              <Select value={f.softboundColor} onValueChange={(v) => updateFile(f.id, 'softboundColor', v as SoftboundColor)}>
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
                          <Textarea value={f.notes} onChange={(e) => updateFile(f.id, 'notes', e.target.value)}
                            placeholder="Double-sided? Specific pages only?" rows={2}
                            className="border-zinc-200 focus-visible:ring-orange-400 resize-none text-sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Separator />

              {/* Submit */}
              <Button onClick={() => { if (isValid) setShowPayment(true); }} disabled={!isValid}
                className="w-full py-6 text-base font-bold bg-orange-500 hover:bg-orange-400 text-white shadow-md shadow-orange-200 disabled:opacity-40">
                Review Order
              </Button>
              <p className="text-center text-zinc-400 text-xs">
                You&apos;ll choose your payment method in the next step.
              </p>

            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-6 text-center text-zinc-400 text-xs bg-white">
        © {new Date().getFullYear()} Connections Copier · All rights reserved
      </footer>

      {/* ── Payment Modal ── */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-zinc-900">Choose Payment Method</DialogTitle>
            <DialogDescription className="text-zinc-500 text-sm">
              How would you like to settle your order of{' '}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-2">
            <button onClick={() => setPaymentMethod('pickup')}
              className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all
                ${paymentMethod === 'pickup' ? 'border-orange-400 bg-orange-50' : 'border-zinc-200 hover:border-orange-200'}`}>
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2M5 9h14l1 11H4L5 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-zinc-800 text-sm">Pay upon Pick-up</p>
                <p className="text-xs text-zinc-400">Cash payment when you collect your order</p>
              </div>
              {paymentMethod === 'pickup' && (
                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            <button onClick={() => setPaymentMethod('gcash')}
              className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all
                ${paymentMethod === 'gcash' ? 'border-blue-400 bg-blue-50' : 'border-zinc-200 hover:border-blue-200'}`}>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-extrabold text-sm">G</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-zinc-800 text-sm">GCash</p>
                <p className="text-xs text-zinc-400">Send payment via GCash before pick-up</p>
              </div>
              {paymentMethod === 'gcash' && (
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>

          <Separator className="my-2" />

          <Button onClick={handleConfirmPayment} disabled={!paymentMethod}
            className="w-full py-5 font-bold text-base bg-orange-500 hover:bg-orange-400 text-white disabled:opacity-40 mt-1">
            Confirm Order →
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}