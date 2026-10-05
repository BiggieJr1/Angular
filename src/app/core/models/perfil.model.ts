export interface PerfilResponse {
  perfilId: string;
  usuarioId: string;
  nombre: string;
  avatarUrl: string | null;
  biografia: string | null;
}

export interface CuentaResponse {
  usuarioId: string;
  email: string;
  rol: string;
  fechaCreacion: string;
  activo: boolean;
}

export interface ProgresoResponse {
  usuarioId: string;
  nivelActual: number;
  puntosTotales: number;
  experiencia: number;
  totalInsignias: number;
  totalIntentos: number;
  totalAprobados: number;
  tasaAciertos: number;
}