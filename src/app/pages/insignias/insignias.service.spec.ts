import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { InsigniasService } from './insignias.service';
import { API_BASE_URL } from '../../core/data-access/api-config';

const CATALOGO = [
  { insigniaId: 'i1', nombre: 'Primer reto', descripcion: 'd1', iconoUrl: null },
  { insigniaId: 'i2', nombre: 'Racha', descripcion: 'd2', iconoUrl: null },
];

describe('InsigniasService', () => {
  let service: InsigniasService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(InsigniasService);
    http = TestBed.inject(HttpTestingController);
  });

  it('separa las insignias ganadas de las que faltan por desbloquear', () => {
    let datos: any;
    service.cargar('u1').subscribe((d) => (datos = d));
    http.expectOne(`${API_BASE_URL}/insignias/u1`).flush([CATALOGO[0]]);
    http.expectOne(`${API_BASE_URL}/insignias`).flush(CATALOGO);

    expect(datos.obtenidas.map((i: any) => i.insigniaId)).toEqual(['i1']);
    expect(datos.porDesbloquear.map((i: any) => i.insigniaId)).toEqual(['i2']);
  });

  it('si el catálogo falla, igual regresa las insignias ganadas', () => {
    let datos: any;
    service.cargar('u1').subscribe((d) => (datos = d));
    http.expectOne(`${API_BASE_URL}/insignias/u1`).flush([CATALOGO[0]]);
    http.expectOne(`${API_BASE_URL}/insignias`).flush('', { status: 500, statusText: 'Error' });

    expect(datos.obtenidas.length).toBe(1);
    expect(datos.porDesbloquear).toEqual([]);
  });
});
