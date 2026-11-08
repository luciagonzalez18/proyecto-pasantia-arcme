import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

  paso: number = 1;

  nombre: string = '';
  foto: string = '';

  constructor(private http: HttpClient, private router: Router, private detector: ChangeDetectorRef) {
    this.verificarSesion();
  }

  // Verifica si hay una sesión iniciada
  verificarSesion() {

    this.http.get<{sesion: boolean, nombre?: string}>(
      '/apiArcme/public/index.php/verificar-sesion'
    ).subscribe({
      next: (respuesta) => {

        if (respuesta.sesion) {
          this.nombre = respuesta.nombre || '';

          // Carga la foto del perfil
          this.cargarFoto();

          this.detector.detectChanges();
        }

      },
      error: (err) => {
        console.error(err);
      }
    });

  }

  // Obtiene la foto guardada en el perfil
  cargarFoto() {

    this.http.get<any>(
      '/apiArcme/public/index.php/perfil'
    ).subscribe({
      next: (respuesta) => {

        this.nombre = respuesta.nombre || '';

        if (respuesta.foto) {
          this.foto = '/apiArcme/public/' + respuesta.foto + '?t=' + Date.now();
        } else {
          this.foto = '';
        }

        this.detector.detectChanges();

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
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
      }
    });

  }
}