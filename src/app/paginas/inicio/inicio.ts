import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Agenda as AgendaService } from '../../servicios/agenda';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private agendaServicios = inject(AgendaService);
  private detector = inject(ChangeDetectorRef);

  // acá se guardan las tarjetas que se muestran
  proximosEventos: any[] = [];

  ngOnInit() {
    this.agendaServicios.proximos().subscribe({
      next: (datos) => {
        this.proximosEventos = datos;
        this.detector.markForCheck();
      },
      error: (err) => console.error('Error al cargar próximos eventos', err)
    });
  }

  // pasa "2026-10-16" a "16/10/2026" para mostrarlo
  formatoFecha(fecha: string): string {
    return fecha.split('-').reverse().join('/');
  }
}