import { supabase } from '../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Only PUT method is allowed' });
  }

  const { id, name, price, image, quantity, description } = req.body;

  const { data, error } = await supabase
    .from('products')
    .update({
      name,
      price,
      image,
      quantity,
      description
    })
    .eq('id', id);

  if (error) {
    return res.status(500).json({ message: 'Failed to update product', error });
  }

  res.status(200).json({ message: 'Product updated successfully', data });
}
