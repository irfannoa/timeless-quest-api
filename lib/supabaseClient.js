// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.https://fbnvobfijhajaafcjvmu.supabase.co;
const supabaseKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibnZvYmZpamhhamFhZmNqdm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MzMxODEsImV4cCI6MjA2MDIwOTE4MX0.aSKexeuxVT7HFFAZB48-cf2ImE-KrBR5uy95ANDfgGo;

export const supabase = createClient(supabaseUrl, supabaseKey);
