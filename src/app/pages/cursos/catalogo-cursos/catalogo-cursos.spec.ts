import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { CatalogoCursos } from './catalogo-cursos';
import { API_BASE_URL } from '../../../core/data-access/api-config';

describe('CatalogoCursos', () => {
  let http: HttpTestingController;

  async function abrir() {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: 'cursos', component: CatalogoCursos }])],
    });
    http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/cursos', CatalogoCursos);
    return harness;
  }

  it('lista los cursos con su número de misiones', async () => {
    const harness = await abrir();
    http.expectOne(`${API_BASE_URL}/cursos`).flush([
      { cursoId: 'c1', titulo: 'Ruta Backend', descripcion: 'd', categoria: 'Backend', fechaCreacion: '', misiones: [{}, {}] },
    ]);
    await harness.fixture.whenStable();
    harness.detectChanges();

    const texto = (harness.routeNativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Ruta Backend');
    expect(texto).toContain('2 misiones');
  });

  it('muestra mensaje cuando no hay cursos', async () => {
    const harness = await abrir();
    http.expectOne(`${API_BASE_URL}/cursos`).flush([]);
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect((harness.routeNativeElement as HTMLElement).textContent).toContain('No hay cursos disponibles');
  });
});
