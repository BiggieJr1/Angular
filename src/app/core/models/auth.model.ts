export interface Usuario {
  usuarioId: string;
  email: string;
  rol: string;
}

export interface SesionActual extends Usuario {
  token: string;
}

export interface LoginResponse extends Usuario {
  token: string;
  expiraEn: string;
}

export interface RegisterResponse {
  usuarioId: string;
  email: string;
  expiraEn: string;
}
