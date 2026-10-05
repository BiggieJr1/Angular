import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/data-access/api-config';
import { Puntuacion } from './models/puntuacion.model';

// HU-12: puntos totales y por categoría del alumno.
// El backend ya incluye "puntosPorCategoria" dentro de GET /api/puntuacion/{usuarioId},
// así que con una sola petición alcanza (no hace falta llamar a /{usuarioId}/categorias).
@Injectable({
  providedIn: 'root',
})
export class PuntuacionService {
  private http = inject(HttpClient);

  consultar(usuarioId: string): Observable<Puntuacion> {
    return this.http.get<Puntuacion>(`${API_BASE_URL}/puntuacion/${usuarioId}`);
  }
}
