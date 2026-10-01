import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leccion } from './leccion';

describe('Leccion', () => {
  let component: Leccion;
  let fixture: ComponentFixture<Leccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leccion],
    }).compileComponents();

    fixture = TestBed.createComponent(Leccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
