import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api-config';
import { UsuarioAdmin } from '../models/usuario-admin.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosAdmin {
  private http = inject(HttpClient);

  listar(): Observable<UsuarioAdmin[]> {
    return this.http.get<UsuarioAdmin[]>(`${API_BASE_URL}/usuarios`);
  }

  cambiarRol(usuarioId: string, rol: string): Observable<UsuarioAdmin> {
    return this.http.put<UsuarioAdmin>(`${API_BASE_URL}/usuarios/${usuarioId}/rol`, { rol });
  }
}
