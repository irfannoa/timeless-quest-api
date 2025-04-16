import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { order_id, status: newStatus } = req.body;

  if (!order_id || !newStatus) {
    return res.status(400).json({ error: 'Missing order ID or new status' });
  }

  // Step 1: Fetch current status
  const { data, error: fetchError } = await supabase
    .from('orders')
    .select('status')
    .eq('order_id', order_id)
    .single();

  if (fetchError || !data) {
    return res.status(404).json({ error: 'Order not found or DB error' });
  }

  const currentStatus = data.status?.toLowerCase();

  if (currentStatus === 'completed') {
    return res.status(400).json({ error: 'Cannot update. Order is already marked as Completed.' });
  }

  // Step 2: Update the status
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('order_id', order_id);

  if (updateError) {
    return res.status(500).json({ error: 'Failed to update order status' });
  }

  return res.status(200).json({ message: `Order status updated to ${newStatus}` });
}
