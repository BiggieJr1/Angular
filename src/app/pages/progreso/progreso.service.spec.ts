import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ProgresoService } from './progreso.service';
import { API_BASE_URL } from '../../core/data-access/api-config';

const RETOS = [
  { retoId: 'r1', titulo: 'Uno', categoria: 'Backend', dificultad: 1 },
  { retoId: 'r2', titulo: 'Dos', categoria: 'Backend', dificultad: 2 },
  { retoId: 'r3', titulo: 'Tres', categoria: 'Frontend', dificultad: 3 },
];

describe('ProgresoService', () => {
  let service: ProgresoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ProgresoService);
    http = TestBed.inject(HttpTestingController);
  });

  function responder(progreso: object | null, intentos: object[], statusProgreso = 200) {
    http.expectOne(`${API_BASE_URL}/retos`).flush(RETOS);
    http.expectOne(`${API_BASE_URL}/retos/u1/intentos`).flush(intentos);
    const req = http.expectOne(`${API_BASE_URL}/usuarios/u1/progreso`);
    if (statusProgreso === 200) {
      req.flush(progreso);
    } else {
      req.flush('', { status: statusProgreso, statusText: 'Error' });
    }
  }

  it('marca como resuelto solo el reto con intento aprobado (un reto aprobado varias veces cuenta una vez)', () => {
    let datos: any;
    service.cargar('u1').subscribe((d) => (datos = d));
    responder({ nivelActual: 2 }, [
      { retoId: 'r1', aprobado: true },
      { retoId: 'r1', aprobado: true }, // repetido
      { retoId: 'r2', aprobado: false }, // intento fallido: sigue pendiente
    ]);

    const resueltos = datos.retos.filter((r: any) => r.resuelto).map((r: any) => r.retoId);
    expect(resueltos).toEqual(['r1']);
    expect(datos.retos.length).toBe(3);
    expect(datos.progreso.nivelActual).toBe(2);
  });

  it('si el usuario no tiene puntuación (404) igual regresa los retos, con progreso null', () => {
    let datos: any;
    service.cargar('u1').subscribe((d) => (datos = d));
    responder(null, [], 404);

    expect(datos.progreso).toBeNull();
    expect(datos.retos.every((r: any) => !r.resuelto)).toBe(true);
  });
});
