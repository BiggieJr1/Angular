// Un CursoConMisiones agrupa y ordena Retos existentes (sus "misiones"). No confundir con
// Curso en models/reto.model.ts, que es en realidad la vista de catálogo de un Reto individual
// (nombre heredado del scaffolding original, antes de conectar la API real).
export interface MisionCurso {
  retoId: string;
  titulo: string;
  categoria: string;
  dificultad: number;
  orden: number;
}

export interface CursoConMisiones {
  cursoId: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  fechaCreacion: string;
  misiones: MisionCurso[];
}

export interface CursoFormValue {
  titulo: string;
  descripcion: string;
  categoria: string;
}
