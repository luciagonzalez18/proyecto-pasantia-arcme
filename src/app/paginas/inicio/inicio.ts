
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Agenda as AgendaService } from '../../services/agenda';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {

  private http = inject(HttpClient);
  private router = inject(Router);
  private agendaServicios = inject(AgendaService);
  private detector = inject(ChangeDetectorRef);

  nombre: string = '';
  proximosEventos: any[] = [];

  ngOnInit() {
    this.verificarSesion();
    this.cargarProximosEventos();
  }

  // Verificar sesión PHP
  verificarSesion() {
    this.http.get<{sesion: boolean, nombre?: string}>(
      '/apiArcme/public/index.php/verificar-sesion'
    ).subscribe({
      next: (respuesta) => {
        if (respuesta.sesion) {
          this.nombre = respuesta.nombre || '';
          this.detector.detectChanges();
        }
      },
      error: (err) => console.error(err)
    });
  }

  // Cerrar sesión
  cerrarSesion() {
    this.http.post(
      '/apiArcme/public/index.php/cerrar-sesion',
      {}
    ).subscribe({
      next: () => {
        this.router.navigate(['/inicioSesion']);
      },
      error: (err) => console.error(err)
    });
  }

  // Cargar próximos eventos
  cargarProximosEventos() {
    this.agendaServicios.proximos().subscribe({
      next: (datos) => {
        this.proximosEventos = datos;
        this.detector.markForCheck();
      },
      error: (err) => console.error('Error al cargar próximos eventos', err)
    });
  }

  // Formatear fecha
  formatoFecha(fecha: string): string {
    return fecha.split('-').reverse().join('/');
  }
}
