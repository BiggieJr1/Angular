// Forma tal cual la regresa BiSoft.GamiProg.Api (GET /api/puntuacion/{usuarioId}).
export interface PuntuacionCategoria {
  puntuacionCategoriaId: string;
  puntuacionId: string;
  categoria: string;
  puntos: number;
}

export interface Puntuacion {
  puntuacionId: string;
  usuarioId: string;
  puntosTotales: number;
  nivelActual: number;
  experiencia: number;
  puntosPorCategoria: PuntuacionCategoria[];
}
