import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-detalles-proveedores',
  imports: [RouterLink],
  templateUrl: './detalles-proveedores.html',
  styleUrl: './detalles-proveedores.css',
})
export class DetallesProveedores {
    Eliminar() {
      Swal.fire({
        title: "¿Deseas eliminar este proveedor?",
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
          text: "Tu proveedor ha sido eliminado.",
          icon: "success"
        });
      });
    }
}
