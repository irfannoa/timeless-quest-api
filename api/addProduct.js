import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }

  const { name, price, image, quantity, description } = req.body;

  // Validate inputs (optional but recommended)
  if (!name || !price || !image || !quantity || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const parsedPrice = parseFloat(price);
  const parsedQuantity = parseInt(quantity, 10);

  if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
    return res.status(400).json({ message: 'Price and quantity must be valid numbers' });
  }

  const product_id = uuidv4(); // Generate a UUID for product_id

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        product_id,
        name,
        price: parsedPrice, // Use parsed values here
        image,
        quantity: parsedQuantity, // And here
        status: 'active',
        description,
      }
    ]);

  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(500).json({ message: 'Failed to add product', error });
  }

  res.status(200).json({ message: 'Product added successfully', data });
}