import { Order, OrderDB, SubmitOrderData } from '@/types/order'
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
            file_path: filePath,
        });

        if (fileError) {
            console.error('File record insert failed:', fileError);
        }
    }

    await fetch('https://hook.eu1.make.com/jwdrl2qk8i7eueabydbl8ht54gwhxoav', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'NEW_ORDER',
        order_id: order.order_id,
        name,
        email,
        branch,
        pickup_date: pickupDate,
      }),
    })
}

// ── Fetch all orders with their file_orders joined ──
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      order_id,
      name,
      email,
      branch,
      pickup_date,
      status,
      created_at,
      updated_at,
      total_price,
      file_orders (
        file_id,
        file_path,
        service,
        copies,
        paper_size,
        color_mode,
        softbound_color,
        notes
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch orders:', error)
    return []
  }

  const typedData = (data ?? []) as OrderDB[]

  return typedData.map((row) => ({
    ...row,
    files: (row.file_orders ?? []).map((f) => ({
      ...f,
      file: new File([], f.file_path),
    })),
  }))
}

export function getFileDownloadUrl(path: string) {
  const { data } = supabase
    .storage
    .from('files')
    .getPublicUrl(path)

  return data.publicUrl
}

// ── Update an order's status ──
export async function updateOrderStatus(
  orderId: string,
  name: string,
  email: string,
  status: Order['status'],
  totalPrice?: number,
): Promise<void> {

  const { error } = await supabase
    .from('orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...(totalPrice !== undefined && { total_price: totalPrice }),
    })
    .eq('order_id', orderId)

  if (error) {
    console.error('Status update failed:', error)
    return
  }

  const { data: order, error: fetchError } = await supabase
  .from('orders')
  .select('*')
  .eq('order_id', orderId)
  .single()

  if (fetchError || !order) {
    console.error('Failed to fetch order:', fetchError)
    return
  }

  try {
    await fetch('https://hook.eu1.make.com/jwdrl2qk8i7eueabydbl8ht54gwhxoav', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'ORDER_READY',
        ...order,
        price: totalPrice,
      }),
    })
  } catch (err) {
    console.error('Webhook failed:', err)
  }
}