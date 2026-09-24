export interface UsuarioAdmin {
  usuarioId: string;
  email: string;
  rol: string;
  fechaCreacion: string;
  activo: boolean;
}

export const ROLES_DISPONIBLES = ['Estudiante', 'Maestro', 'Admin'] as const;
