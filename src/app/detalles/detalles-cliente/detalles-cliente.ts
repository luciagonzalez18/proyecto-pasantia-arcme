import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes';
import { ProyectosService } from '../../services/proyectos';
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

  constructor(
    private clientesService: ClientesService,
    private proyectosService: ProyectosService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) { }

  cliente: any = null;

  // Proyectos que pertenecen al cliente.
  proyectosCliente: any[] = [];

  ngOnInit(): void {
    this.clienteCargado();

    if (this.cliente) {
      this.editarCliente.patchValue({
        nombre: this.cliente.nombre,
        telefono: this.cliente.telefono,
        direccion: this.cliente.direccion,
        ciudad: this.cliente.ciudad,
        correo: this.cliente.correo,
      });

      // Cargar las obras vinculadas a este cliente.
      this.cargarProyectosCliente();
    }
  }

  clienteCargado() {
    this.cliente = this.clientesService.clienteSeleccionado;
    this.cdr.markForCheck();
  }

  volverAtras() {
    this.location.back();
  }

  editarCliente = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required])
  });

  // CARGAR PROYECTOS DEL CLIENTE.
  cargarProyectosCliente() {
    this.proyectosService.listarPorCliente(this.cliente.id_cliente).subscribe({
      next: (respuesta: any[]) => {
        this.proyectosCliente = respuesta;
        this.cdr.detectChanges();
        console.log('Obras del cliente:', respuesta);
      },
      error: (error: any) => {
        console.error('Error al cargar las obras del cliente:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las obras vinculadas.',
          icon: 'error'
        });
      }
    });
  }

  // ELIMINAR CLIENTE.
  Eliminar(id: number) {
    Swal.fire({
      title: "¿Deseas eliminar este cliente?",
      text: "¡Esta acción no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2f6f7e",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, quiero borrarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientesService.eliminar(id).subscribe({
          next: (respuesta: any) => {
            Swal.fire({
              title: "Eliminado",
              text: "Tu cliente ha sido eliminado.",
              icon: "success"
            }).then(() => {
              this.router.navigate(['/clientes']);
            });
            console.log("Cliente eliminado", respuesta);
          }
        });
      }
    });
  }

  // MODIFICAR CLIENTE.
  modificarCliente(id: number) {
    if (this.editarCliente.invalid) {
      this.editarCliente.markAllAsTouched();
      return;
    }

    const valores = this.editarCliente.getRawValue();
    const clienteActualizado = {
      ...this.cliente,
      nombre: valores.nombre,
      telefono: valores.telefono,
      direccion: valores.direccion,
      ciudad: valores.ciudad,
      correo: valores.correo
    };

    this.clientesService.actualizar(id, clienteActualizado).subscribe({
      next: (respuesta: any) => {
        this.cliente = clienteActualizado;
        this.clientesService.clienteSeleccionado = this.cliente;

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
      },
      error: (error: any) => {
        console.error('Error al actualizar el cliente:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el cliente.',
          icon: 'error'
        });
      }
    });
  }
}