import { FileOrder } from '@/types/order';
import { useSearchParams } from 'next/dist/client/components/navigation';
import { useEffect, useState } from 'react';

export function useCustomerForm(files: FileOrder[]) {
    function isValidEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    const searchParams = useSearchParams();
    const validBranches = ['Western', 'EVSU Outside', 'EVSU Inside'];
    const branchParam = searchParams.get('branch') ?? '';
    const initialBranch = validBranches.includes(branchParam) ? branchParam : ''

    const [name, setName] = useState('')    ;
    const [email, setEmail] = useState('');
    const [branch, setBranch] = useState(initialBranch);
    const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined)
    
    const isValid =
        name.trim() !== '' &&
        isValidEmail(email) &&
        pickupDate !== undefined &&
        files.length > 0 &&
        files.every((f) => f.service && f.copies > 0);
    
    return {
        name, setName,
        email, setEmail,
        branch, setBranch,
        pickupDate, setPickupDate,
        isValid,
    };
}