import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, shareReplay } from 'rxjs';
import { API_BASE_URL } from '../../core/data-access/api-config';
import { PerfilService } from '../../core/data-access/perfil.service';
import { ClasificacionPagina } from './models/clasificacion.model';

// HU-14: leaderboard global.
// El backend solo devuelve usuarioId, puntos y nivel (no el nombre), así que los nombres
// se resuelven aparte con el perfil de cada usuario y se guardan en caché.
@Injectable({
  providedIn: 'root',
})
export class ClasificacionService {
  private http = inject(HttpClient);
  private perfilService = inject(PerfilService);
  private cacheNombres = new Map<string, Observable<string | null>>();

  consultarGlobal(pagina: number): Observable<ClasificacionPagina> {
    return this.http.get<ClasificacionPagina>(`${API_BASE_URL}/leaderboard/global`, {
      params: { pagina },
    });
  }

  // Regresa { usuarioId: nombre } solo de los perfiles que se pudieron consultar
  nombresDe(usuarioIds: string[]): Observable<Record<string, string>> {
    if (usuarioIds.length === 0) {
      return of({});
    }
    return forkJoin(usuarioIds.map((id) => this.nombre(id).pipe(map((nombre) => [id, nombre] as const)))).pipe(
      map((pares) => {
        const nombres: Record<string, string> = {};
        for (const [id, nombre] of pares) {
          if (nombre) {
            nombres[id] = nombre;
          }
        }
        return nombres;
      }),
    );
  }

  private nombre(usuarioId: string): Observable<string | null> {
    let consulta = this.cacheNombres.get(usuarioId);
    if (!consulta) {
      consulta = this.perfilService.consultarPerfil(usuarioId).pipe(
        map((perfil) => perfil.nombre || null),
        // Si el usuario no tiene perfil (404) o falla, se muestra un nombre genérico
        catchError(() => of(null)),
        shareReplay(1),
      );
      this.cacheNombres.set(usuarioId, consulta);
    }
    return consulta;
  }
}
