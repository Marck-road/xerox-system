import { FileOrder } from '@/types/order';
import React from 'react';

type Props = {
    files: FileOrder[];
    isDragging: boolean;
    setIsDragging: (v: boolean) => void;
    addFiles: (files: FileList | null) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    fileInput: React.RefObject<HTMLInputElement | null>;
};

export default function FileUpload({
    files,
    isDragging,
    setIsDragging,
    addFiles,
    onDrop,
    fileInput
}: Props) {
    return(
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    addFiles(e.target.files)
                }
            />

            {files.length === 0 ? (
            <div
                onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
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
    )
}