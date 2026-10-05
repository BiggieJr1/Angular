// Forma tal cual la regresa BiSoft.GamiProg.Api (GET /api/insignias y GET /api/insignias/{usuarioId}).
// iconoUrl es opcional en el backend: puede venir vacío o null.
export interface Insignia {
  insigniaId: string;
  nombre: string;
  descripcion: string;
  iconoUrl: string | null;
}

export interface DatosInsignias {
  // Las que el alumno ya ganó
  obtenidas: Insignia[];
  // Las del catálogo que todavía no tiene
  porDesbloquear: Insignia[];
}
