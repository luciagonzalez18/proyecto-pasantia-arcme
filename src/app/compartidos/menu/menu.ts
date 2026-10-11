import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  paso: number = 1;

  constructor(private router: Router) {}

  cerrarSesion() {
    Swal.fire({
      title: "¿Seguro que quieres cerrar sesión?",
      text: "No se perderán los datos guardados",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cerrar Sesión"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Sesión Cerrada!",
          text: "Has cerrado tu sesión.",
          icon: "success"
        }).then(() => {
          this.router.navigate(['/home']);
        });
      }
    });
  }
}
