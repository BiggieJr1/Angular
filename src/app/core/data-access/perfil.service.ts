import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-config';
import { CuentaResponse, PerfilResponse, ProgresoResponse } from '../models/perfil.model';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private http = inject(HttpClient);

  consultarPerfil(usuarioId: string) {
    return this.http.get<PerfilResponse>(`${API_BASE_URL}/usuarios/${usuarioId}/perfil`);
  }

  consultarCuenta(usuarioId: string) {
    return this.http.get<CuentaResponse>(`${API_BASE_URL}/usuarios/${usuarioId}`);
  }

  consultarProgreso(usuarioId: string) {
    return this.http.get<ProgresoResponse>(`${API_BASE_URL}/usuarios/${usuarioId}/progreso`);
  }

  actualizarPerfil(
    usuarioId: string,
    datos: { nombre: string; avatarUrl: string | null; biografia: string | null },
  ) {
    return this.http.put<unknown>(`${API_BASE_URL}/usuarios/${usuarioId}/perfil`, datos);
  }
}