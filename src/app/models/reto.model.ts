// Forma tal cual la regresa BiSoft.GamiProg.Api (GET /api/retos, GET /api/retos/{id}).
export interface ConsultarRetoResponse {
  retoId: string;
  titulo: string;
  descripcion: string;
  dificultad: number;
  lenguajeRequerido: string;
  categoria: string;
  codigoBase: string;
  totalIntentos: number;
  tasaExito: number;
  resueltoPorUsuario: boolean;
}

// Modelo que consumen los componentes de catálogo/detalle. gradienteBg y badgeColor son
// puramente de presentación y no existen en el backend: se derivan por categoría en Cursos.
export interface Curso {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  duracion: string;
  gradienteBg: string;
  badgeColor: string;
}
