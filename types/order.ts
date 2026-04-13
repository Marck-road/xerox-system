export type ColorMode= 'black-and-white' | 'colored';
export type SoftboundColor = 'yellow' | 'red' | 'blue' | 'orange' | 'green';
export type PaperSize = 'A4' | 'short' | 'long';
export type Service = 'print-only' | 'print-softbound' | 'print-laminate';

export interface FileOrder {
  id: string;
  file: File;
  copies: number;
  colorMode: ColorMode;
  paperSize: PaperSize;
  softboundColor: SoftboundColor | null;
  service: Service;
  notes: string;
}