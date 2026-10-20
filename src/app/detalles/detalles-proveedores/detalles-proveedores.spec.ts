import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesProveedores } from './detalles-proveedores';

describe('DetallesProveedores', () => {
  let component: DetallesProveedores;
  let fixture: ComponentFixture<DetallesProveedores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesProveedores],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesProveedores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
