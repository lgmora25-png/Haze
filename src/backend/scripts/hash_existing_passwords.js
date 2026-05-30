import bcrypt from 'bcrypt'
import { supabase } from '../src/config/conexion.js'

// Script para hashear contraseñas en la tabla 'usuarios' que parecen estar en texto plano.
// Requisitos: ejecutar desde la carpeta src/backend con Node.js 18+ y tener .env configurado.

async function run() {
  console.log('Iniciando migración de contraseñas...')

  // 1. Obtener todos los usuarios (puede filtrarse si la tabla es muy grande)
  const { data: usuarios, error } = await supabase
    .from('usuarios')
    .select('id, contrasena')

  if (error) {
    console.error('Error al leer usuarios:', error)
    process.exit(1)
  }

  if (!usuarios || usuarios.length === 0) {
    console.log('No se encontraron usuarios para procesar.')
    return
  }

  const saltRounds = 10
  let updated = 0

  for (const u of usuarios) {
    const raw = u.contrasena || ''
    // Detectar si ya está hasheada por bcrypt: normalmente empieza con $2a$|$2b$|$2y$
    if (typeof raw === 'string' && raw.startsWith('$2')) {
      continue
    }

    if (!raw.trim()) {
      console.warn(`Usuario ${u.id} tiene contraseña vacía, saltando.`)
      continue
    }

    try {
      const hash = await bcrypt.hash(raw, saltRounds)
      const { data, error: updErr } = await supabase
        .from('usuarios')
        .update({ contrasena: hash })
        .eq('id', u.id)

      if (updErr) {
        console.error(`Error actualizando usuario ${u.id}:`, updErr)
      } else {
        updated++
        console.log(`Usuario ${u.id} actualizado.`)
      }
    } catch (err) {
      console.error(`Fallo al hashear usuario ${u.id}:`, err)
    }
  }

  console.log(`Migración finalizada. Filas actualizadas: ${updated}`)
}

run().catch(err => { console.error(err); process.exit(1) })
