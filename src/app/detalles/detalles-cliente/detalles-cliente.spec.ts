import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesCliente } from './detalles-cliente';

describe('DetallesCliente', () => {
  let component: DetallesCliente;
  let fixture: ComponentFixture<DetallesCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesCliente],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
