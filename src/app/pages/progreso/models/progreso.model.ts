// Forma tal cual la regresa BiSoft.GamiProg.Api (GET /api/usuarios/{usuarioId}/progreso).
export interface DesgloseLenguaje {
  lenguaje: string;
  totalIntentos: number;
  totalAprobados: number;
  tasaAciertos: number;
}

export interface ProgresoUsuario {
  usuarioId: string;
  nivelActual: number;
  puntosTotales: number;
  experiencia: number;
  totalInsignias: number;
  totalIntentos: number;
  // Ojo: cuenta intentos aprobados, no retos distintos (un reto se puede aprobar varias veces).
  totalAprobados: number;
  tasaAciertos: number;
  porLenguaje: DesgloseLenguaje[];
}

// Solo los campos que usamos de GET /api/retos/{usuarioId}/intentos.
export interface IntentoResumen {
  retoId: string;
  aprobado: boolean;
}

// Un reto del catálogo junto con si el alumno ya lo resolvió.
export interface RetoProgreso {
  retoId: string;
  titulo: string;
  categoria: string;
  dificultad: number;
  resuelto: boolean;
}

export interface DatosProgreso {
  // null cuando el backend no tiene puntuación para el usuario (por ejemplo, 404)
  progreso: ProgresoUsuario | null;
  retos: RetoProgreso[];
}
