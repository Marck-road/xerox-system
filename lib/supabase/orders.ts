import { SubmitOrderData } from '@/types/order'
import { createClient } from './client';

const supabase = createClient();

export async function submitOrder({ name, email, branch, pickupDate, files }: SubmitOrderData) {
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            name,
            email,
            branch,
            pickup_date: pickupDate?.toISOString(),
            status: 'pending',
            updated_at: new Date().toISOString(),
        })
        .select('order_id')
        .single();

    if (orderError || !order) {
        console.error('Order insert failed:', orderError);
        return;
    }

    for (const f of files) {
        const filePath = `${order.order_id}/${f.file.name}`;
        const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, f.file);

        if (uploadError) {
            console.error('File upload failed:', uploadError);
            continue;
        }

        const { error: fileError } = await supabase
        .from('file_orders')
        .insert({
            order_id: order.order_id,
            service: f.service,
            copies: f.copies,
            paper_size: f.paper_size,
            color_mode: f.color_mode,
            softbound_color: f.softbound_color ?? null,
            notes: f.notes,
            file_name: f.file.name,
        });

        if (fileError) {
            console.error('File record insert failed:', fileError);
        }
    }

    // const { data } = await supabase.storage
    //     .from('files')
    //     .createSignedUrl(`${order_id}/${file_name}`, 3600)
}
