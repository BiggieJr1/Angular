import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { MiProgreso } from './progreso';
import { API_BASE_URL } from '../../core/data-access/api-config';

const RETOS = [
  { retoId: 'r1', titulo: 'Invertir cadena', categoria: 'Backend', dificultad: 1 },
  { retoId: 'r2', titulo: 'Ordenar lista', categoria: 'Backend', dificultad: 2 },
];

describe('MiProgreso', () => {
  let http: HttpTestingController;

  async function abrir(conSesion: boolean) {
    localStorage.clear();
    if (conSesion) {
      localStorage.setItem(
        'gamiprog_sesion_actual',
        JSON.stringify({ usuarioId: 'u1', email: 'a@b.c', rol: 'Estudiante', token: 't' }),
      );
    }
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: 'mi-progreso', component: MiProgreso }])],
    });
    http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/mi-progreso', MiProgreso);
    return harness;
  }

  afterEach(() => localStorage.clear());

  it('muestra cuántos retos resolvió, cuáles le faltan y sus estadísticas', async () => {
    const harness = await abrir(true);
    http.expectOne(`${API_BASE_URL}/usuarios/u1/progreso`).flush({
      nivelActual: 3, puntosTotales: 120, experiencia: 40, totalInsignias: 2,
      totalIntentos: 4, totalAprobados: 2, tasaAciertos: 50,
      porLenguaje: [{ lenguaje: 'C#', totalIntentos: 4, totalAprobados: 2, tasaAciertos: 50 }],
    });
    http.expectOne(`${API_BASE_URL}/retos`).flush(RETOS);
    http.expectOne(`${API_BASE_URL}/retos/u1/intentos`).flush([{ retoId: 'r1', aprobado: true }]);
    await harness.fixture.whenStable();
    harness.detectChanges();

    const texto = (harness.routeNativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('1');
    expect(texto).toContain('de 2');
    expect(texto).toContain('Me faltan (1)');
    expect(texto).toContain('Ordenar lista'); // pendiente
    expect(texto).toContain('Resueltos (1)');
    expect(texto).toContain('120'); // puntos
    expect(texto).toContain('C#');
  });

  it('funciona aunque el usuario no tenga puntuación (progreso 404): muestra sus retos', async () => {
    const harness = await abrir(true);
    http.expectOne(`${API_BASE_URL}/usuarios/u1/progreso`).flush('', { status: 404, statusText: 'Not Found' });
    http.expectOne(`${API_BASE_URL}/retos`).flush(RETOS);
    http.expectOne(`${API_BASE_URL}/retos/u1/intentos`).flush([]);
    await harness.fixture.whenStable();
    harness.detectChanges();

    const texto = (harness.routeNativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Me faltan (2)');
    expect(texto).not.toContain('Insignias'); // sin tarjetas de puntuación
  });

  it('sin sesión invita a iniciar sesión y no consulta la API', async () => {
    const harness = await abrir(false);
    await harness.fixture.whenStable();
    harness.detectChanges();

    http.expectNone(`${API_BASE_URL}/retos`);
    expect((harness.routeNativeElement as HTMLElement).textContent).toContain('Inicia sesión');
  });
});
