import { FileOrder } from '@/types/order';
import { useCallback, useState } from 'react';

export function useFileUpload() {
    const [files, setFiles] = useState<FileOrder[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    
    const addFiles = (list: FileList | null) => {
        if (!list) return;
        const next: FileOrder[] = Array.from(list).map((file) => ({
            file_id: crypto.randomUUID(),
            file_path: file.name,
            file,
            copies: 1,
            color_mode: 'colored',
            paper_size: 'short', softbound_color: null,
            service: 'print-only', notes: '',
        }));
        setFiles((prev) => [...prev, ...next]);
    };

    const removeFile = (id: string) =>
        setFiles((prev) => prev.filter((f) => f.file_id !== id));
    
    const updateFile = <K extends keyof FileOrder>(id: string, key: K, val: FileOrder[K]) =>
        setFiles((prev) => prev.map((f) => f.file_id === id ? { ...f, [key]: val } : f));

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