import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  const {
    first_name,
    last_name,
    phone,
    email,
    address1,
    address2,
    country,
    state,
    city,
    postcode,
    cart,
    user_id 
  } = data;

  if (!user_id || !cart || cart.length === 0) {
    return res.status(400).json({ error: 'Invalid input or missing cart/user_id' });
  }

  const orderId = uuidv4();
  const created_at = new Date().toISOString();
  const status = 'pending';

  // Insert into `orders` table
  const { error: orderError } = await supabase.from('orders').insert([
    {
      order_id: orderId,
      first_name,
      last_name,
      phone,
      email,
      address1,
      address2,
      country,
      state,
      city,
      postcode,
      status,
      created_at
    }
  ]);

  if (orderError) {
    return res.status(500).json({ error: orderError.message });
  }

  // Insert items into `order_items`
  const orderItems = cart.map(item => ({
    order_item_id: uuidv4(),
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
    price_each: item.price
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) {
    return res.status(500).json({ error: itemsError.message });
  }

  // Clear the cart
  await supabase.from('cart').delete().eq('user_id', user_id);

  return res.status(200).json({ status: 'success', order_id: orderId });
}
