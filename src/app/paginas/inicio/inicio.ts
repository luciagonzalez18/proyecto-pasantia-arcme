import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {

  nombre: string = '';
  
    constructor(private http: HttpClient, private router: Router, private detector: ChangeDetectorRef) {
      this.verificarSesion();
    }
  
    // Obtiene el nombre desde la sesión PHP
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
        error: (err) => {
          console.error(err);
        }
      });
  
    }
  
    cerrarSesion() {
  
      this.http.post(
        '/apiArcme/public/index.php/cerrar-sesion',
        {}
      ).subscribe({
        next: () => {
          this.router.navigate(['/inicioSesion']);
        },
        error: (err) => {
          console.error(err);
        }
      });
  
    }
}
