// src/models/Pago.js
export class Pago {
  constructor(data = {}) {
    this.pago_id = data.pago_id ?? data.id ?? null
    this.cliente_nombre = data.cliente_nombre ?? ''
    this.cliente_documento = data.cliente_documento ?? ''
    this.telefono = data.telefono ?? ''
    this.monto = data.monto ?? 0
    this.metodo = data.metodo ?? ''
    this.estado = data.estado ?? 'pendiente'
    this.creado_at = data.creado_at ?? data.created_at ?? new Date().toISOString()
  }

  esValido() {
    return (
      String(this.cliente_nombre).trim().length > 0 &&
      String(this.cliente_documento).trim().length > 0 &&
      Number(this.monto) > 0
    )
  }
}
