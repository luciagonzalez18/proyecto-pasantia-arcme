import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-detalles-proyecto',
  imports: [RouterLink],
  templateUrl: './detalles-proyecto.html',
  styleUrl: './detalles-proyecto.css',
})
export class DetallesProyecto {

  Eliminar() {
    Swal.fire({
      title: "¿Deseas eliminar este proyecto?",
      text: "Esta acción no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "rgb(167, 163, 163)",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) Swal.fire({
        title: "Eliminado",
        text: "Tu proyecto ha sido eliminado.",
        icon: "success"
      });
    });
  }
}
