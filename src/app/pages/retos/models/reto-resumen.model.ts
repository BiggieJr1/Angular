// Forma tal cual la regresa BiSoft.GamiProg.Api.
// GET /api/retos/mios -> ResumenRetoMaestro[]  (HU-25)
export interface ResumenRetoMaestro {
  retoId: string;
  titulo: string;
  categoria: string;
  dificultad: number;
  totalIntentos: number;
  totalAlumnos: number;
  totalAprobados: number;
  // Porcentaje de 0 a 100 (aprobados / intentos)
  tasaExito: number;
}

// GET /api/retos/{id}/resultados -> ResultadoAlumnoReto[]
export interface ResultadoAlumnoReto {
  usuarioId: string;
  totalIntentos: number;
  aprobado: boolean;
  ultimoIntento: string;
}

// Umbrales para etiquetar un reto según su tasa de éxito (ajustables)
export const MIN_INTENTOS_VEREDICTO = 3;
export const TASA_DIFICIL = 30;
export const TASA_FACIL = 80;
