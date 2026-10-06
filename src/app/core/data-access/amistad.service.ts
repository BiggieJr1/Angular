import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-config';
import { AmigoResponse } from '../models/amistad.model';

export interface InvitacionPreview {
  usuarioId: string;
  nombre: string;
  avatarUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class AmistadService {
  private http = inject(HttpClient);

  generarInvitacion() {
    return this.http.post<{ codigo: string }>(`${API_BASE_URL}/amistades/invitacion/generar`, {});
  }

  consultarInvitacion(codigo: string) {
    return this.http.get<InvitacionPreview>(`${API_BASE_URL}/amistades/invitacion/${encodeURIComponent(codigo)}`);
  }

  aceptarInvitacion(codigo: string) {
    return this.http.post<unknown>(`${API_BASE_URL}/amistades/invitacion/aceptar`, {
      codigoAmigo: codigo,
    });
  }

  consultarAmistades(usuarioId: string) {
    return this.http.get<AmigoResponse[]>(`${API_BASE_URL}/usuarios/${usuarioId}/amistades`);
  }

  eliminarAmistad(seguidoId: string) {
    return this.http.delete<void>(`${API_BASE_URL}/amistades/${seguidoId}`);
  }
}
