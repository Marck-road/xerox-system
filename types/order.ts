export type ColorMode= 'black-and-white' | 'colored';
export type SoftboundColor = 'yellow' | 'red' | 'blue' | 'orange' | 'green';
export type PaperSize = 'A4' | 'short' | 'long';
export type Service = 'print-only' | 'print-softbound' | 'print-laminate';

export interface FileOrder {
  file_id: string;
  file: File;
  service: Service;
  copies: number;
  paper_size: PaperSize;
  color_mode: ColorMode;
  softbound_color: SoftboundColor | null;
  notes: string;
}

export interface Order {
  order_id: string;
  name: string;
  email: string;
  branch: string;
  pickup_date: string; 
  files: FileOrder[];
  created_at: string; 
  updated_at: string;
  status: 'pending' | 'ready' | 'completed' | 'cancelled';
}