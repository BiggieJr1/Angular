import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../core/api-config';
import { ConsultarRetoResponse, Curso } from '../models/reto.model';

// Las claves deben coincidir con las categorías del carrusel de filtros en home.ts.
// imagenUrl es opcional: solo Frontend y Backend tienen imagen propia por ahora: el
// resto sigue con el degradado de color hasta que existan sus imágenes.
const ESTILOS_POR_CATEGORIA: Record<string, { gradienteBg: string; badgeColor: string; imagenUrl?: string }> = {
  Frontend: { gradienteBg: 'from-red-500 to-pink-500', badgeColor: 'bg-red-100 text-red-800', imagenUrl: 'img/categorias/frontend.jpg' },
  Backend: { gradienteBg: 'from-green-500 to-emerald-600', badgeColor: 'bg-green-100 text-green-800', imagenUrl: 'img/categorias/backend.jpg' },
  DevOps: { gradienteBg: 'from-blue-500 to-cyan-500', badgeColor: 'bg-blue-100 text-blue-800' },
  'Bases de Datos': { gradienteBg: 'from-purple-500 to-indigo-500', badgeColor: 'bg-purple-100 text-purple-800' },
  Ciberseguridad: { gradienteBg: 'from-slate-700 to-slate-900', badgeColor: 'bg-slate-200 text-slate-800' },
  'Diseño UI/UX': { gradienteBg: 'from-fuchsia-500 to-purple-500', badgeColor: 'bg-fuchsia-100 text-fuchsia-800' },
  Cloud: { gradienteBg: 'from-sky-400 to-blue-500', badgeColor: 'bg-sky-100 text-sky-800' },
};
const ESTILO_DEFAULT = { gradienteBg: 'from-slate-500 to-slate-700', badgeColor: 'bg-slate-100 text-slate-800' };

function aCurso(reto: ConsultarRetoResponse): Curso {
  const estilo = ESTILOS_POR_CATEGORIA[reto.categoria] ?? ESTILO_DEFAULT;
  return {
    id: reto.retoId,
    titulo: reto.titulo,
    descripcion: reto.descripcion,
    categoria: reto.categoria,
    duracion: `Nivel ${reto.dificultad}/5`,
    gradienteBg: estilo.gradienteBg,
    badgeColor: estilo.badgeColor,
    imagenUrl: estilo.imagenUrl,
  };
}

@Injectable({
  providedIn: 'root'
})
export class Cursos {
  private http = inject(HttpClient);

  obtenerCursos(): Observable<Curso[]> {
    return this.http
      .get<ConsultarRetoResponse[]>(`${API_BASE_URL}/retos`)
      .pipe(map(retos => retos.map(aCurso)));
  }

  obtenerCursoPorId(id: string): Observable<Curso> {
    return this.http
      .get<ConsultarRetoResponse>(`${API_BASE_URL}/retos/${id}`)
      .pipe(map(aCurso));
  }
}
