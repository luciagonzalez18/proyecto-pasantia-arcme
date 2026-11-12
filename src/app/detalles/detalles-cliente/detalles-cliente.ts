import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-detalles-cliente',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './detalles-cliente.html',
  styleUrl: './detalles-cliente.css',
})
export class DetallesCliente implements OnInit {

  constructor(private clientesService: ClientesService, private router: Router, private cdr: ChangeDetectorRef, private location: Location) { }
  cliente: any = null

  ngOnInit(): void {  

    this.clienteCargado()

    if (this.cliente) {
      this.editarCliente.patchValue({
        nombre: this.cliente.nombre,
        telefono: this.cliente.telefono,
        direccion: this.cliente.direccion,
        ciudad: this.cliente.ciudad,
        correo: this.cliente.correo,
      });
    }
  }

   clienteCargado() {
    this.cliente = this.clientesService.clienteSeleccionado
    this.cdr.markForCheck();
    console.log(this.clientesService.clienteSeleccionado)
  }

  volverAtras() {
    this.location.back();
  }

  editarCliente = new FormGroup({
    nombre: new FormControl('', [
      Validators.required
    ]),
    telefono: new FormControl('', [
      Validators.required
    ]),
    direccion: new FormControl('', [
      Validators.required
    ]),
    ciudad: new FormControl('', [
      Validators.required
    ]),
    correo: new FormControl('', [
      Validators.required
    ])
  })

    Eliminar(id: number) {
       Swal.fire({
         title: "¿Deseas eliminar este cliente?",
         text: "Esta acción no se puede revertir!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#2f6f7e",
         cancelButtonColor: "#d33",
         cancelButtonText: "Cancelar",
         confirmButtonText: "Si, quiero borralo!"
       }).then((result) => {
         if (result.isConfirmed) Swal.fire({
           title: "Eliminado",
           text: "Tu cliente ha sido eliminado.",
           icon: "success"
         }).then(() => {
           this.clientesService.eliminar(id).subscribe({
             next: (respuesta: any) => {
               this.router.navigate(['/clientes'])
               console.log("Cliente eliminado", respuesta)
             }
           })
   
         })
       })
     }
   
     modificarCliente(id: number) {
       if (this.editarCliente.invalid) {
         this.editarCliente.markAllAsTouched();
         return;
       }

         const valores = this.editarCliente.getRawValue();

    const clienteActualizado = {
      ...this.cliente,// ... :Se utilizan para copiar o expandir las propiedades de un objeto dentro de otro.
      nombre: valores.nombre,
      telefono: valores.telefono,
      direccion: valores.direccion,
      ciudad: valores.ciudad,
      correo: valores.correo
    };
    this.clientesService.actualizar(id, clienteActualizado).subscribe({
          next: (respuesta: any) => {
            // Actualizamos los datos que muestra la página.
            this.cliente = clienteActualizado;
    
            // Actualizamos el objeto compartido por el servicio.
            this.clientesService.clienteSeleccionado = this.cliente;
    
            // Actualizamos los campos del formulario.
            this.editarCliente.patchValue({
              nombre: this.cliente.nombre,
              telefono: this.cliente.telefono,
              direccion: this.cliente.direccion,
              ciudad: this.cliente.ciudad,
              correo: this.cliente.correo
            });
    
            this.cdr.detectChanges();
  
    
            Swal.fire({
              title: 'Cliente actualizado',
              text: 'Los cambios se guardaron correctamente.',
              icon: 'success',
              confirmButtonText: 'Continuar',
              confirmButtonColor: '#2f6f7e'
            });
    
            console.log('Respuesta del servidor:', respuesta);
          },
          error: (error) => {
            console.error('Error al actualizar el cliente:', error);
    
            Swal.fire({
              title: 'Error',
              text: 'No se pudo actualizar el cliente .',
              icon: 'error'
            });
          }
        });



  }

}

   