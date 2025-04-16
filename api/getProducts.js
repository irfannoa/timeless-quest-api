import { supabase } from '../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET allowed' });
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active');

  if (error) {
    return res.status(500).json({ message: 'Failed to fetch products', error });
  }

  res.status(200).json(data);
}
