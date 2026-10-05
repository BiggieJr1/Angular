import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PuntuacionService } from './puntuacion.service';
import { API_BASE_URL } from '../../core/data-access/api-config';

describe('PuntuacionService', () => {
  it('consulta GET /puntuacion/{usuarioId} y regresa los puntos por categoría', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const service = TestBed.inject(PuntuacionService);
    const http = TestBed.inject(HttpTestingController);

    let resultado: any;
    service.consultar('u1').subscribe((p) => (resultado = p));
    http.expectOne(`${API_BASE_URL}/puntuacion/u1`).flush({
      puntosTotales: 150,
      puntosPorCategoria: [{ categoria: 'Backend', puntos: 150 }],
    });

    expect(resultado.puntosTotales).toBe(150);
    expect(resultado.puntosPorCategoria[0].categoria).toBe('Backend');
  });
});
