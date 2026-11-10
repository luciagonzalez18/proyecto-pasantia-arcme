import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesProyecto } from './detalles-proyecto';

describe('DetallesProyecto', () => {
  let component: DetallesProyecto;
  let fixture: ComponentFixture<DetallesProyecto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesProyecto],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesProyecto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
