import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 1. Cargar las variables de entorno del archivo .env de forma segura
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Control de calidad: Verificar que las credenciales no lleguen vacías
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Faltan las variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY en tu archivo .env");
}

// 2. Inicializar y EXPORTAR el cliente de Supabase de manera moderna
export const supabase = createClient(supabaseUrl, supabaseKey);