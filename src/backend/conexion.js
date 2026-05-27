const { createClient } = require('@supabase/supabase-js');

// Abre la página de Supabase, copia tus datos de API y pégalos aquí adentro de las comillas:
const supabaseUrl = 'https://gxjgdmqnzsljspziixcf.supabase.co';
const supabaseKey = 'sb_publishable_dGDEj66nAgpSjCz8jzcw1w_vcOiy-De';

// Aquí se crea el cliente que usaremos para hacer consultas
const supabase = createClient(supabaseUrl, supabaseKey);

// Exportamos la conexión para poder usarla en tus controladores más adelante
module.exports = supabase;