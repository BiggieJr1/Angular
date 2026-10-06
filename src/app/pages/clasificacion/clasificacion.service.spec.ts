import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { LeaderboardService } from './clasificacion.service';
import { API_BASE_URL } from '../../core/data-access/api-config';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(LeaderboardService);
    http = TestBed.inject(HttpTestingController);
  });

  it('consulta GET /leaderboard/global con el parámetro pagina', () => {
    let resultado: any;
    service.consultarGlobal(2).subscribe((r) => (resultado = r));
    const req = http.expectOne((r) => r.url === `${API_BASE_URL}/leaderboard/global`);
    expect(req.request.params.get('pagina')).toBe('2');
    req.flush({ pagina: 2, tamanoPagina: 20, totalRegistros: 25, entradas: [] });

    expect(resultado.pagina).toBe(2);
  });

  it('resuelve nombres y omite los perfiles que fallan', () => {
    let nombres: any;
    service.nombresDe(['u1', 'u2']).subscribe((n) => (nombres = n));
    http.expectOne(`${API_BASE_URL}/usuarios/u1/perfil`).flush({ nombre: 'Ana' });
    http.expectOne(`${API_BASE_URL}/usuarios/u2/perfil`).flush('', { status: 404, statusText: 'Not Found' });

    expect(nombres).toEqual({ u1: 'Ana' });
  });

  it('guarda en caché el nombre para no repetir la petición', () => {
    service.nombresDe(['u1']).subscribe();
    http.expectOne(`${API_BASE_URL}/usuarios/u1/perfil`).flush({ nombre: 'Ana' });

    let nombres: any;
    service.nombresDe(['u1']).subscribe((n) => (nombres = n));
    http.expectNone(`${API_BASE_URL}/usuarios/u1/perfil`);
    expect(nombres).toEqual({ u1: 'Ana' });
  });
});
