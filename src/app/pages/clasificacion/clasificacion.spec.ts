import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { Clasificacion } from './clasificacion';
import { API_BASE_URL } from '../../core/data-access/api-config';

const URL_LB = `${API_BASE_URL}/clasificacion/global`;

function pagina(n: number, total: number, entradas: object[]) {
  return { pagina: n, tamanoPagina: 20, totalRegistros: total, entradas };
}

describe('Clasificacion', () => {
  let http: HttpTestingController;

  async function abrir(conSesion: boolean) {
    localStorage.clear();
    if (conSesion) {
      localStorage.setItem('gamiprog_sesion_actual', JSON.stringify({ usuarioId: 'u1', email: 'a@b.c', rol: 'Estudiante', token: 't' }));
    }
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: 'clasificacion', component: Clasificacion }])],
    });
    http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/clasificacion', Clasificacion);
    if (conSesion) {
      // AuthService consulta el perfil del usuario con sesión al iniciar
      http.match(`${API_BASE_URL}/usuarios/u1/perfil`).forEach((r) => r.flush({ nombre: 'Yo' }));
    }
    return harness;
  }

  const texto = (h: RouterTestingHarness) => (h.routeNativeElement as HTMLElement).textContent ?? '';
  const pedirPagina = (n: string) => http.expectOne((r) => r.url === URL_LB && r.params.get('pagina') === n);

  afterEach(() => localStorage.clear());

  it('muestra la tabla con nombres, puntos y marca al usuario actual', async () => {
    const harness = await abrir(true);
    pedirPagina('1').flush(
      pagina(1, 2, [
        { posicion: 1, usuarioId: 'u2', puntosTotales: 300, nivelActual: 4 },
        { posicion: 2, usuarioId: 'u1', puntosTotales: 150, nivelActual: 2 },
      ]),
    );
    http.expectOne(`${API_BASE_URL}/usuarios/u2/perfil`).flush({ nombre: 'Ana' });
    http.expectOne(`${API_BASE_URL}/usuarios/u1/perfil`).flush('', { status: 404, statusText: 'Not Found' });
    await harness.fixture.whenStable();
    harness.detectChanges();

    const t = texto(harness);
    expect(t).toContain('Ana');
    expect(t).toContain('300');
    expect(t).toContain('Nivel 4');
    // u1 (yo) no tiene perfil en el leaderboard: se usa el nombre de la sesión y la etiqueta "Tú"
    expect(t).toContain('Yo');
    expect(t).toContain('Tú');
  });

  it('pide la siguiente página al pulsar "Siguiente"', async () => {
    const harness = await abrir(true);
    pedirPagina('1').flush(pagina(1, 25, [{ posicion: 1, usuarioId: 'u2', puntosTotales: 10, nivelActual: 1 }]));
    http.expectOne(`${API_BASE_URL}/usuarios/u2/perfil`).flush({ nombre: 'Ana' });
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(texto(harness)).toContain('Página 1 de 2');

    const botones = Array.from((harness.routeNativeElement as HTMLElement).querySelectorAll('button'));
    botones.find((b) => b.textContent?.includes('Siguiente'))!.click();
    harness.detectChanges();

    pedirPagina('2').flush(pagina(2, 25, [{ posicion: 21, usuarioId: 'u3', puntosTotales: 5, nivelActual: 1 }]));
    http.expectOne(`${API_BASE_URL}/usuarios/u3/perfil`).flush({ nombre: 'Luis' });
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(texto(harness)).toContain('Página 2 de 2');
    expect(texto(harness)).toContain('Luis');
  });

  it('si no hay alumnos con puntos muestra un mensaje', async () => {
    const harness = await abrir(true);
    pedirPagina('1').flush(pagina(1, 0, []));
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(texto(harness)).toContain('Todavía no hay alumnos con puntos');
  });

  it('muestra un error si falla la petición', async () => {
    const harness = await abrir(true);
    pedirPagina('1').flush('', { status: 500, statusText: 'Error' });
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(texto(harness)).toContain('No se pudo cargar el leaderboard');
  });

  it('sin sesión pide iniciar sesión y no llama al backend', async () => {
    const harness = await abrir(false);
    harness.detectChanges();

    expect(texto(harness)).toContain('Inicia sesión para ver el leaderboard');
    http.expectNone((r) => r.url === URL_LB);
  });
});
