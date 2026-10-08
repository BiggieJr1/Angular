import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/data-access/api-config';
import { CasoPruebaAdmin, RetoCompleto, RetoFormValue } from './models/reto-admin.model';
import { ResultadoAlumnoReto, ResumenRetoMaestro } from './models/reto-resumen.model';

@Injectable({
  providedIn: 'root',
})
export class RetosAdmin {
  private http = inject(HttpClient);

  crear(datos: RetoFormValue): Observable<RetoCompleto> {
    return this.http.post<RetoCompleto>(`${API_BASE_URL}/retos`, datos);
  }

  actualizar(retoId: string, datos: RetoFormValue): Observable<RetoCompleto> {
    return this.http.put<RetoCompleto>(`${API_BASE_URL}/retos/${retoId}`, datos);
  }

  obtenerCompleto(retoId: string): Observable<RetoCompleto> {
    return this.http.get<RetoCompleto>(`${API_BASE_URL}/retos/${retoId}/completo`);
  }

  agregarCasoPrueba(retoId: string, caso: { entrada: string; salidaEsperada: string; visible: boolean }): Observable<CasoPruebaAdmin> {
    return this.http.post<CasoPruebaAdmin>(`${API_BASE_URL}/retos/${retoId}/casos-prueba`, caso);
  }

  // HU-25: retos del maestro autenticado con intentos, alumnos y tasa de éxito (el Admin ve todos)
  misRetos(): Observable<ResumenRetoMaestro[]> {
    return this.http.get<ResumenRetoMaestro[]>(`${API_BASE_URL}/retos/mios`);
  }

  // HU-25: resultado de cada alumno en un reto (403 si el reto no es del maestro)
  resultadosPorAlumno(retoId: string): Observable<ResultadoAlumnoReto[]> {
    return this.http.get<ResultadoAlumnoReto[]>(`${API_BASE_URL}/retos/${retoId}/resultados`);
  }
}
