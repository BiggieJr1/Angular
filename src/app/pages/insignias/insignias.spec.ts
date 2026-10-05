import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { MisInsignias } from './insignias';
import { API_BASE_URL } from '../../core/data-access/api-config';

const CATALOGO = [
  { insigniaId: 'i1', nombre: 'Primer reto', descripcion: 'Resuelve tu primer reto', iconoUrl: null },
  { insigniaId: 'i2', nombre: 'Racha de 5', descripcion: 'Resuelve cinco retos', iconoUrl: null },
];

describe('MisInsignias', () => {
  let http: HttpTestingController;

  async function abrir(conSesion: boolean) {
    localStorage.clear();
    if (conSesion) {
      localStorage.setItem('gamiprog_sesion_actual', JSON.stringify({ usuarioId: 'u1', email: 'a@b.c', rol: 'Estudiante', token: 't' }));
    }
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: 'mis-insignias', component: MisInsignias }])],
    });
    http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/mis-insignias', MisInsignias);
    return harness;
  }

  const texto = (h: RouterTestingHarness) => (h.routeNativeElement as HTMLElement).textContent ?? '';

  async function responder(harness: RouterTestingHarness, obtenidas: object[]) {
    http.expectOne(`${API_BASE_URL}/insignias/u1`).flush(obtenidas);
    http.expectOne(`${API_BASE_URL}/insignias`).flush(CATALOGO);
    await harness.fixture.whenStable();
    harness.detectChanges();
  }

  afterEach(() => localStorage.clear());

  it('muestra las insignias ganadas y las que faltan por desbloquear', async () => {
    const harness = await abrir(true);
    await responder(harness, [CATALOGO[0]]);

    const t = texto(harness);
    expect(t).toContain('Ganadas (1)');
    expect(t).toContain('Primer reto');
    expect(t).toContain('Por desbloquear (1)');
    expect(t).toContain('Racha de 5');
    expect(t).toContain('de 2');
  });

  it('si no ha ganado ninguna, lo anima a resolver retos', async () => {
    const harness = await abrir(true);
    await responder(harness, []);

    expect(texto(harness)).toContain('Aún no has ganado ninguna insignia');
  });

  it('muestra un error si falla la petición', async () => {
    const harness = await abrir(true);
    http.expectOne(`${API_BASE_URL}/insignias/u1`).flush('', { status: 500, statusText: 'Error' });
    http.expectOne(`${API_BASE_URL}/insignias`).flush(CATALOGO);
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(texto(harness)).toContain('No se pudieron cargar tus insignias');
  });

  it('sin sesión pide iniciar sesión y no llama al backend', async () => {
    const harness = await abrir(false);
    harness.detectChanges();

    expect(texto(harness)).toContain('Inicia sesión para ver tus insignias');
    http.expectNone(`${API_BASE_URL}/insignias/u1`);
  });
});
