// src/repositories/UsuarioRepository.js

import { supabase } from '../config/conexion.js'; 
import { Usuario } from '../models/Usuario.js';
// Eliminamos la importación de bcrypt

export class UsuarioRepository {
  
  // === HISTORIA DE USUARIO 3: Registrar Perfil ===
  async crear(usuarioInstancia) {
    const { data: usuarioExistente, error: errorBusqueda } = await supabase
      .from('usuarios')
      .select('id')
      .or(`correo.eq.${usuarioInstancia.correo},nombre_usuario.eq.${usuarioInstancia.nombre_usuario}`)
      .limit(1);

    if (errorBusqueda) {
      console.error("Error de Supabase:", errorBusqueda);
      throw new Error(`Error interno al verificar usuario: ${errorBusqueda.message}`);
    }

    if (usuarioExistente && usuarioExistente.length > 0) {
      throw new Error("El usuario ya existe");
    }

    // Insertamos directamente la contraseña en texto plano
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        nombre_usuario: usuarioInstancia.nombre_usuario,
        correo: usuarioInstancia.correo,
        contrasena: usuarioInstancia.contrasena 
      }])
      .select();

    if (error) {
      console.error("Error de Supabase al insertar:", error);
      throw new Error(`Error al crear el perfil en la BD: ${error.message}`);
    }
    
    return new Usuario(data[0]);
  }

  // === LÓGICA DE LOGIN ===
  async loginUsuario(correo, contrasenaPlana) {
    // 1. Buscamos al usuario por correo
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo', correo)
      .single(); 

    if (error || !usuario) {
      throw new Error('El usuario no existe');
    }

    // 2. Comparamos las contraseñas directamente (Texto plano contra texto plano)
    if (usuario.contrasena !== contrasenaPlana) {
      throw new Error('Contraseña incorrecta');
    }

    // 3. Devolvemos la instancia del usuario si todo está OK
    return new Usuario(usuario);
  }

  // === HISTORIA DE USUARIO 4: Consultar Perfil ===
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return new Usuario(data);
  }
}