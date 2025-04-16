import { supabase } from '../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Only DELETE method is allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ message: 'Failed to delete product', error });
  }

  res.status(200).json({ message: 'Product deleted successfully' });
}
