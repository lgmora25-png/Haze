import { supabase } from '../src/config/conexion.js';

async function check() {
  const ref = '1234567999'
  console.log('Buscando pago_ref ilike %' + ref + '%')
  const { data, error } = await supabase.from('pagos').select('*').ilike('pago_ref', `%${ref}%`)
  if (error) {
    console.error('Error:', error)
    process.exit(1)
  }
  console.log('Encontrados:', data && data.length)
  console.log(JSON.stringify(data, null, 2))
}

check()
