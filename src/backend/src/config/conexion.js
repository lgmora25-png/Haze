import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 1. Cargar las variables de entorno del archivo .env de forma segura
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey;
const usingServiceRole = Boolean(supabaseServiceRoleKey);

// Control de calidad: Verificar que las credenciales no lleguen vacías
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Faltan las variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY en tu archivo .env");
}

if (!usingServiceRole) {
  console.warn('⚠️ El backend está usando la clave ANÓNIMA de Supabase. Para acceder a tablas con permisos restringidos como pagos, configura SUPABASE_SERVICE_ROLE_KEY.');
}

// 2. Inicializar y EXPORTAR el cliente de Supabase de manera moderna
export const supabase = createClient(supabaseUrl, supabaseKey);