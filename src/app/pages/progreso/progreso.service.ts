import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { API_BASE_URL } from '../../core/data-access/api-config';
import { ConsultarRetoResponse } from '../retos/models/reto.model';
import { DatosProgreso, IntentoResumen, ProgresoUsuario } from './models/progreso.model';

// HU-11: junta lo necesario para la pantalla "Mi progreso".
// GET /api/usuarios/{id}/progreso trae nivel, puntos y tasa de aciertos, pero no dice qué retos
// resolvió el alumno ni cuáles le faltan; eso se calcula con el catálogo de retos y su historial
// de intentos.
@Injectable({
  providedIn: 'root',
})
export class ProgresoService {
  private http = inject(HttpClient);

  cargar(usuarioId: string): Observable<DatosProgreso> {
    return forkJoin({
      // Si el usuario aún no tiene puntuación, seguimos mostrando sus retos
      progreso: this.http
        .get<ProgresoUsuario>(`${API_BASE_URL}/usuarios/${usuarioId}/progreso`)
        .pipe(catchError(() => of(null))),
      retos: this.http.get<ConsultarRetoResponse[]>(`${API_BASE_URL}/retos`),
      intentos: this.http.get<IntentoResumen[]>(`${API_BASE_URL}/retos/${usuarioId}/intentos`),
    }).pipe(
      map(({ progreso, retos, intentos }) => {
        // Un reto cuenta como resuelto con al menos un intento aprobado (aunque lo haya aprobado varias veces)
        const resueltos = new Set(intentos.filter((i) => i.aprobado).map((i) => i.retoId));
        return {
          progreso,
          retos: retos.map((reto) => ({
            retoId: reto.retoId,
            titulo: reto.titulo,
            categoria: reto.categoria,
            dificultad: reto.dificultad,
            resuelto: resueltos.has(reto.retoId),
          })),
        };
      }),
    );
  }
}
