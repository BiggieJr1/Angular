import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, tap } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { LoginResponse, RegisterResponse, SesionActual, Usuario } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private sesionKey = 'gamiprog_sesion_actual';

  // Estado del modal de login/registro, compartido para que cualquier componente
  // (ej. "Inscribirme" en un reto) pueda pedir que el usuario inicie sesión.
  isModalOpen = signal(false);
  isLoginMode = signal(true);

  // Usuario con sesión activa, compartido para que cualquier componente (navbar,
  // guards, etc.) reaccione a un login/logout sin tener que recargar la página.
  usuarioActual = signal<Usuario | null>(this.usuarioDesdeSesion());

  constructor() {
    // Al recargar la página, la sesión se restaura y hay que volver a pedir el nombre
    const usuario = this.usuarioActual();
    if (usuario) this.cargarNombre(usuario.usuarioId);
  }

  abrirModal(esLogin: boolean) {
    this.isLoginMode.set(esLogin);
    this.isModalOpen.set(true);
    document.body.classList.add('overflow-hidden');
  }

  cerrarModal() {
    this.isModalOpen.set(false);
    document.body.classList.remove('overflow-hidden');
  }

  // 1. REGISTRAR USUARIO (el backend no devuelve token al registrar, así que iniciamos sesión después)
  registrar(email: string, password: string, nombre: string): Observable<Usuario> {
    return this.http
      .post<RegisterResponse>(`${API_BASE_URL}/security/register`, { email, password, nombre })
      .pipe(switchMap(() => this.iniciarSesion(email, password)));
  }

  // 2. INICIAR SESIÓN
  iniciarSesion(email: string, password: string): Observable<Usuario> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/security/login`, { email, password })
      .pipe(
        tap((respuesta) => {
          const sesion: SesionActual = {
            usuarioId: respuesta.usuarioId,
            email: respuesta.email,
            rol: respuesta.rol,
            token: respuesta.token,
          };
          localStorage.setItem(this.sesionKey, JSON.stringify(sesion));
          this.usuarioActual.set({
            usuarioId: sesion.usuarioId,
            email: sesion.email,
            rol: sesion.rol,
          });
          this.cargarNombre(sesion.usuarioId); // <- nuevo
        }),
        map((respuesta) => ({
          usuarioId: respuesta.usuarioId,
          email: respuesta.email,
          rol: respuesta.rol,
        })),
      );
  }

  // 3. CERRAR SESIÓN
  cerrarSesion() {
    localStorage.removeItem(this.sesionKey);
    this.usuarioActual.set(null);
  }

  // 4. SABER QUIÉN ESTÁ CONECTADO
  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioActual();
  }

  // Usado por el interceptor para adjuntar el Bearer token a las peticiones protegidas
  obtenerToken(): string | null {
    return this.obtenerSesion()?.token ?? null;
  }

  private obtenerSesion(): SesionActual | null {
    const data = localStorage.getItem(this.sesionKey);
    return data ? JSON.parse(data) : null;
  }

  private cargarNombre(usuarioId: string) {
    this.http.get<{ nombre: string }>(`${API_BASE_URL}/usuarios/${usuarioId}/perfil`).subscribe({
      next: (perfil) =>
        this.usuarioActual.update((u) =>
          // Solo si sigue siendo el mismo usuario (por si cerró sesión mientras cargaba)
          u && u.usuarioId === usuarioId ? { ...u, nombre: perfil.nombre } : u,
        ),
      error: () => {
        // Sin perfil o fallo de red: se queda el respaldo "Mi cuenta"
      },
    });
  }

  private usuarioDesdeSesion(): Usuario | null {
    const sesion = this.obtenerSesion();
    return sesion ? { usuarioId: sesion.usuarioId, email: sesion.email, rol: sesion.rol } : null;
  }
}
