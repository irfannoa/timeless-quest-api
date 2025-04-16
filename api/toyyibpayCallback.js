import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  const orderId = data?.refno;
  const paymentStatus = data?.status === '1' ? 'paid' : 'failed';
  const billCode = data?.billcode || null;

  if (!orderId) {
    return res.status(400).json({ error: 'Missing order ID.' });
  }

  // Optional: log the callback for debugging
  console.log('ToyyibPay Callback:', JSON.stringify(data, null, 2));

  const { error } = await supabase
    .from('orders')
    .update({
      status: paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('order_id', orderId);

  if (error) {
    console.error('Supabase update error:', error.message);
    return res.status(500).json({ error: 'Server error.' });
  }

  return res.status(200).send('Callback handled successfully.');
}
