import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fbnvobfijhajaafcjvmu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibnZvYmZpamhhamFhZmNqdm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MzMxODEsImV4cCI6MjA2MDIwOTE4MX0.aSKexeuxVT7HFFAZB48-cf2ImE-KrBR5uy95ANDfgGo'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { name, price, image, description, quantity } = req.body;

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, price, image, description, quantity, status: 'active' }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Product added successfully', data });
}