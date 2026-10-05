import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { API_BASE_URL } from '../../core/data-access/api-config';
import { DatosInsignias, Insignia } from './models/insignia.model';

// HU-13: insignias del alumno.
// GET /api/insignias/{usuarioId} trae las que ganó; GET /api/insignias trae el catálogo completo,
// que usamos para mostrar también las que aún le faltan (sentido de colección).
@Injectable({
  providedIn: 'root',
})
export class InsigniasService {
  private http = inject(HttpClient);

  cargar(usuarioId: string): Observable<DatosInsignias> {
    return forkJoin({
      obtenidas: this.http.get<Insignia[]>(`${API_BASE_URL}/insignias/${usuarioId}`),
      // Si el catálogo falla, igual mostramos las insignias ganadas
      catalogo: this.http.get<Insignia[]>(`${API_BASE_URL}/insignias`).pipe(catchError(() => of([] as Insignia[]))),
    }).pipe(
      map(({ obtenidas, catalogo }) => {
        const ids = new Set(obtenidas.map((i) => i.insigniaId));
        return {
          obtenidas,
          porDesbloquear: catalogo.filter((i) => !ids.has(i.insigniaId)),
        };
      }),
    );
  }
}
