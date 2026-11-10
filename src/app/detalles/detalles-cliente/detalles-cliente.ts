import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-detalles-cliente',
  imports: [RouterLink],
  templateUrl: './detalles-cliente.html',
  styleUrl: './detalles-cliente.css',
})
export class DetallesCliente {
    Eliminar() {
      Swal.fire({
        title: "¿Deseas eliminar este cliente?",
        text: "Esta acción no se puede revertir!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar"
      }).then((result) => {
        if (result.isConfirmed) Swal.fire({
          title: "Eliminado",
          text: "Tu cliente ha sido eliminado.",
          icon: "success"
        });
      });
    }
}
