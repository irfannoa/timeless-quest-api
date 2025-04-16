import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  const userId = user.id;

  const { data, error } = await supabase
    .from('cart')
    .select('quantity, products (name, image, price)')
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ error: 'Failed to retrieve cart items', details: error.message });
  }

  const items = data.map(item => ({
    name: item.products.name,
    image: item.products.image,
    quantity: parseInt(item.quantity),
    price: parseFloat(item.products.price)
  }));

  return res.status(200).json(items);
}
