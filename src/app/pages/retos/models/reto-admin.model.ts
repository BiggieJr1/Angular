// Vista completa del reto para quien lo crea/edita (Maestro/Admin): incluye la solución
// esperada y todos los casos de prueba, incluidos los ocultos. No confundir con Curso
// (models/reto.model.ts), que es la vista pública/recortada para el catálogo.
export interface CasoPruebaAdmin {
  casoPruebaId: string;
  entrada: string;
  salidaEsperada: string;
  visible: boolean;
}

export interface RetoCompleto {
  retoId: string;
  titulo: string;
  descripcion: string;
  dificultad: number;
  lenguajeRequerido: string;
  categoria: string;
  codigoBase: string;
  solucionEsperada: string;
  casosPrueba: CasoPruebaAdmin[];
}

export interface RetoFormValue {
  titulo: string;
  descripcion: string;
  dificultad: number;
  lenguajeRequerido: string;
  categoria: string;
  codigoBase: string;
  solucionEsperada: string;
}

// Mismas categorías que el carrusel de filtros en home.ts, para que un reto nuevo
// siempre caiga en una categoría que el catálogo ya sabe filtrar y mostrar con imagen.
export const CATEGORIAS_RETO = [
  'Frontend',
  'Backend',
  'DevOps',
  'Bases de Datos',
  'Ciberseguridad',
  'Diseño UI/UX',
  'Cloud',
] as const;
