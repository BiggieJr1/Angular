// Forma tal cual la regresa BiSoft.GamiProg.Api (GET /api/leaderboard/global?pagina=N).
export interface ClasificacionEntrada {
  posicion: number;
  usuarioId: string;
  puntosTotales: number;
  nivelActual: number;
}

export interface ClasificacionPagina {
  pagina: number;
  tamanoPagina: number;
  totalRegistros: number;
  entradas: ClasificacionEntrada[];
}
