// Metemos la librería y las credenciales directo aquí para descartar
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gxjgdmqnzsljspziixcf.supabase.co';
const supabaseKey = 'sb_publishable_dGDEj66nAgpSjCz8jzcw1w_vcOiy-De';

const supabase = createClient(supabaseUrl, supabaseKey);

async function consultarJuegos() {
  console.log('Conectando directamente con Supabase...');
  
  const { data, error } = await supabase
    .from('juegos')
    .select('*');

  if (error) {
    console.error('¡Error en la base de datos!:', error.message);
    return;
  }

  console.log('--- ¡CONEXIÓN EXITOSA EN HAZE! ---');
  console.table(data); 
}

consultarJuegos();