import { useState, useCallback } from 'react';
import { FileOrder } from '@/types/order';

export function useFileUpload() {
    const [files, setFiles] = useState<FileOrder[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    
    const addFiles = (list: FileList | null) => {
        if (!list) return;
        const next: FileOrder[] = Array.from(list).map((file) => ({
          id: crypto.randomUUID(),
          file,
          copies: 1,
          colorMode: 'colored',
          paperSize: 'short', softboundColor: null,
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

    return {
        files,
        isDragging,
        setIsDragging,
        addFiles,
        removeFile,
        setFiles,
        updateFile,
        onDrop
    }
}