import { FileOrder } from '@/types/order';
import { useState } from 'react';

export function useCustomerForm(files: FileOrder[]) {
    function isValidEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const [name, setName] = useState('')    ;
    const [email, setEmail] = useState('');
    const [branch, setBranch] = useState('');
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