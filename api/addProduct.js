import { supabase } from '../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }

  const { name, price, image, quantity, description } = req.body;

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name,
        price,
        image,
        quantity,
        description,
        status: 'active'
      }
    ]);

  if (error) {
    return res.status(500).json({ message: 'Failed to add product', error });
  }

  res.status(200).json({ message: 'Product added successfully', data });
}
