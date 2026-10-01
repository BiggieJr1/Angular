import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { RutaCurso } from './ruta-curso';
import { API_BASE_URL } from '../../../core/data-access/api-config';
import { CursoConMisiones } from '../models/curso.model';

const CURSO: CursoConMisiones = {
  cursoId: 'c1',
  titulo: 'Ruta Backend',
  descripcion: 'Descripción',
  categoria: 'Backend',
  fechaCreacion: '2026-01-01T00:00:00Z',
  // Desordenadas a propósito: la vista debe respetar "orden"
  misiones: [
    { retoId: 'r2', titulo: 'Segunda', categoria: 'Backend', dificultad: 2, orden: 2 },
    { retoId: 'r1', titulo: 'Primera', categoria: 'Backend', dificultad: 1, orden: 1 },
  ],
};

describe('RutaCurso', () => {
  let http: HttpTestingController;

  async function abrir(conSesion: boolean) {
    localStorage.clear();
    if (conSesion) {
      localStorage.setItem(
        'gamiprog_sesion_actual',
        JSON.stringify({ usuarioId: 'u1', email: 'a@b.c', rol: 'Alumno', token: 't' })
      );
    }
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'cursos/:id', component: RutaCurso }]),
      ],
    });
    http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/cursos/c1', RutaCurso);
    return harness;
  }

  afterEach(() => localStorage.clear());

  it('muestra las misiones en orden con su estado resuelta/pendiente', async () => {
    const harness = await abrir(true);
    http.expectOne(`${API_BASE_URL}/cursos/c1`).flush(CURSO);
    http.expectOne(`${API_BASE_URL}/retos/u1/intentos`).flush([
      { retoId: 'r1', aprobado: true },
      { retoId: 'r2', aprobado: false }, // intento fallido: sigue pendiente
    ]);
    await harness.fixture.whenStable();
    harness.detectChanges();

    const texto = (harness.routeNativeElement as HTMLElement).textContent ?? '';
    expect(texto.indexOf('Primera')).toBeLessThan(texto.indexOf('Segunda'));
    expect(texto).toContain('Resuelta');
    expect(texto).toContain('Pendiente');
    expect(texto).toContain('1 de 2 misiones resueltas');
  });

  it('sin sesión no pide intentos ni muestra estados, e invita a iniciar sesión', async () => {
    const harness = await abrir(false);
    http.expectOne(`${API_BASE_URL}/cursos/c1`).flush(CURSO);
    await harness.fixture.whenStable();
    harness.detectChanges();

    http.expectNone(`${API_BASE_URL}/retos/u1/intentos`);
    const texto = (harness.routeNativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Inicia sesión');
    expect(texto).not.toContain('Pendiente');
  });

  it('muestra "Curso no encontrado" si el backend responde 404', async () => {
    const harness = await abrir(false);
    http.expectOne(`${API_BASE_URL}/cursos/c1`).flush('', { status: 404, statusText: 'Not Found' });
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect((harness.routeNativeElement as HTMLElement).textContent).toContain('Curso no encontrado');
  });
});
