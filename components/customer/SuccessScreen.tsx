import { Button } from '@/components/ui/button';
import { FileOrder } from '@/types/order';

type Props = {
  name: string | undefined;
  email: string | undefined;
  files: FileOrder[];
  onReset: () => void;
};

export default function SuccessScreen({ 
    name,
    email,
    files,
    onReset 
}: Props) {
    return(
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
                <p className="mt-1">Number of files uploaded: <span className="font-bold">{files.length}</span></p>
            </div>
            <Button variant="outline" onClick={onReset} className='cursor-pointer'>Submit another order</Button>
        </div>
    )
}