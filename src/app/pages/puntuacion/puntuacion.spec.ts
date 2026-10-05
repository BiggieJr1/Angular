import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { MiPuntuacion } from './puntuacion';
import { API_BASE_URL } from '../../core/data-access/api-config';

describe('MiPuntuacion', () => {
  let http: HttpTestingController;

  async function abrir(conSesion: boolean) {
    localStorage.clear();
    if (conSesion) {
      localStorage.setItem('gamiprog_sesion_actual', JSON.stringify({ usuarioId: 'u1', email: 'a@b.c', rol: 'Estudiante', token: 't' }));
    }
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: 'mi-puntuacion', component: MiPuntuacion }])],
    });
    http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/mi-puntuacion', MiPuntuacion);
    return harness;
  }

  const texto = (h: RouterTestingHarness) => (h.routeNativeElement as HTMLElement).textContent ?? '';

  afterEach(() => localStorage.clear());

  it('muestra puntos totales y por categoría (de mayor a menor)', async () => {
    const harness = await abrir(true);
    http.expectOne(`${API_BASE_URL}/puntuacion/u1`).flush({
      puntuacionId: 'p1',
      usuarioId: 'u1',
      puntosTotales: 150,
      nivelActual: 2,
      experiencia: 150,
      puntosPorCategoria: [
        { puntuacionCategoriaId: 'c1', puntuacionId: 'p1', categoria: 'Frontend', puntos: 50 },
        { puntuacionCategoriaId: 'c2', puntuacionId: 'p1', categoria: 'Backend', puntos: 100 },
      ],
    });
    await harness.fixture.whenStable();
    harness.detectChanges();

    const t = texto(harness);
    expect(t).toContain('150');
    expect(t).toContain('Backend');
    expect(t).toContain('100 pts');
    expect(t.indexOf('Backend')).toBeLessThan(t.indexOf('Frontend'));
    expect(t).toContain('Te faltan 50 XP para el nivel 3');
  });

  it('si el usuario aún no tiene puntuación (404) invita a resolver un reto', async () => {
    const harness = await abrir(true);
    http.expectOne(`${API_BASE_URL}/puntuacion/u1`).flush('', { status: 404, statusText: 'Not Found' });
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(texto(harness)).toContain('Aún no tienes puntos');
  });

  it('muestra un error si falla la petición', async () => {
    const harness = await abrir(true);
    http.expectOne(`${API_BASE_URL}/puntuacion/u1`).flush('', { status: 500, statusText: 'Error' });
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(texto(harness)).toContain('No se pudo cargar tu puntuación');
  });

  it('sin sesión pide iniciar sesión y no llama al backend', async () => {
    const harness = await abrir(false);
    harness.detectChanges();

    expect(texto(harness)).toContain('Inicia sesión para ver tu puntuación');
    http.expectNone(`${API_BASE_URL}/puntuacion/u1`);
  });
});
