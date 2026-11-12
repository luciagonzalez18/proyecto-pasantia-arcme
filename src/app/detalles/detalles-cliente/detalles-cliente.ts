
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

  // Proyectos que ya pertenecen al cliente.
  proyectosCliente: any[] = [];

  // Proyectos disponibles para vincular.
  obrasDisponibles: any[] = [];

  // ID de la obra seleccionada en el select.
  proyectoSeleccionadoId: number | null = null;


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

      // Cargar las obras vinculadas al cliente.
      this.cargarProyectosCliente();

      // Cargar las obras disponibles para vincular.
      this.cargarObrasDisponibles();

    }

  }


  clienteCargado() {

    this.cliente = this.clientesService.clienteSeleccionado;

    this.cdr.markForCheck();

    console.log(this.clientesService.clienteSeleccionado);

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

  });


  // CARGAR PROYECTOS VINCULADOS AL CLIENTE.

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


  // CARGAR PROYECTOS DISPONIBLES.

  cargarObrasDisponibles() {

    this.proyectosService.listarDisponibles().subscribe({

      next: (respuesta: any[]) => {

        this.obrasDisponibles = respuesta;

        this.cdr.detectChanges();

        console.log('Obras disponibles:', respuesta);

      },

      error: (error: any) => {

        console.error('Error al cargar las obras disponibles:', error);

        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los proyectos disponibles.',
          icon: 'error'
        });

      }

    });

  }


  // VINCULAR OBRA AL CLIENTE ACTUAL.

  vincularObra() {

    if (this.proyectoSeleccionadoId === null) {

      Swal.fire({
        title: 'Seleccioná una obra',
        text: 'Debes seleccionar un proyecto antes de continuar.',
        icon: 'warning'
      });

      return;

    }

    const datos = {
      id_cliente: this.cliente.id_cliente
    };

    this.proyectosService.vincular(
      this.proyectoSeleccionadoId,
      datos
    ).subscribe({

      next: (respuesta: any) => {

        // Limpiar la selección.
        this.proyectoSeleccionadoId = null;

        // Actualizar las tarjetas.
        this.cargarProyectosCliente();

        // Actualizar el select.
        this.cargarObrasDisponibles();

        Swal.fire({
          title: 'Obra vinculada',
          text: 'La obra se vinculó correctamente al cliente.',
          icon: 'success',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#2f6f7e'
        });

        console.log('Respuesta del servidor:', respuesta);

      },

      error: (error: any) => {

        console.error('Error al vincular la obra:', error);

        Swal.fire({
          title: 'Error',
          text: error.error?.error || 'No se pudo vincular la obra.',
          icon: 'error'
        });

      }

    });

  }


  // ELIMINAR CLIENTE.

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

      if (result.isConfirmed) {

        Swal.fire({
          title: "Eliminado",
          text: "Tu cliente ha sido eliminado.",
          icon: "success"

        }).then(() => {

          this.clientesService.eliminar(id).subscribe({

            next: (respuesta: any) => {

              this.router.navigate(['/clientes']);

              console.log("Cliente eliminado", respuesta);

            }

          });

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
