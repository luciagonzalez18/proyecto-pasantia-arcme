import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProyectosService } from '../../services/proyectos';
import { ClientesService } from '../../services/clientes'; 
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles-proyecto',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './detalles-proyecto.html',
  styleUrl: './detalles-proyecto.css',
})
export class DetallesProyecto implements OnInit {

  constructor(
    private proyectoService: ProyectosService,
    private clientesService: ClientesService,
    private router: Router, 
    private cdr: ChangeDetectorRef, 
    private location: Location
  ) { }

  proyecto: any = null; //Declarar la variable para almacenar el proyecto seleccionado
  listaClientes: any[] = []; // Declarar la lista para el select del modal

  ngOnInit(): void {
    this.proyectoCargado(); // Cargar el proyecto seleccionado al iniciar el componente
    this.cargarClientes(); //Cargar clientes al iniciar el componente para el select del modal

    if (this.proyecto) {
      this.editarProyecto.patchValue({
        titulo: this.proyecto.titulo,
        superficie: this.proyecto.superficie,
        ubicacion: this.proyecto.ubicacion,
        precio: this.proyecto.precio,
        nomenclatura: this.proyecto.nomenclatura,
        fecha_inicio: this.proyecto.fecha_inicio,
        fecha_finalizacion: this.proyecto.fecha_finalizacion,
        estado: this.proyecto.estado,
        memoria: this.proyecto.memoria,
        descripcion: this.proyecto.descripcion,
        id_cliente: this.proyecto.id_cliente
      });
    }
  }

  proyectoCargado() {
    this.proyecto = this.proyectoService.proyectoSeleccionado;
    this.cdr.markForCheck();
    console.log(this.proyectoService.proyectoSeleccionado);
  }

  // Método para obtener todos los clientes desde la API
  cargarClientes() {
    this.clientesService.listar().subscribe({
      next: (respuesta: any) => {
        this.listaClientes = respuesta;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar la lista de clientes:', error);
      }
    });
  }

  volverAtras() {
    this.location.back();
  }

  editarProyecto = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    superficie: new FormControl('', [Validators.required]),
    ubicacion: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required]),
    nomenclatura: new FormControl('', [Validators.required]),
    fecha_inicio: new FormControl('', [Validators.required]),
    fecha_finalizacion: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required]),
    memoria: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    id_cliente: new FormControl('', [Validators.required])
  });

  Eliminar(id: number) {
    Swal.fire({
      title: "¿Deseas eliminar este proyecto?",
      text: "¡Esta acción no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2f6f7e",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, quiero borrarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado",
          text: "Tu proyecto ha sido eliminado.",
          icon: "success"
        }).then(() => {
          this.proyectoService.eliminar(id).subscribe({
            next: (respuesta: any) => {
              this.router.navigate(['/proyectos']);
              console.log("Proyecto eliminado", respuesta);
            }
          });
        });
      }
    });
  }

  modificarProyecto(id: number) {
    if (this.editarProyecto.invalid) {
      this.editarProyecto.markAllAsTouched();
      return;
    }

    const valores = this.editarProyecto.getRawValue();

    const proyectoActualizado = {
      ...this.proyecto,
      titulo: valores.titulo,
      superficie: valores.superficie,
      ubicacion: valores.ubicacion,
      precio: valores.precio,
      descripcion: valores.descripcion,
      nomenclatura: valores.nomenclatura,
      estado: valores.estado,
      memoria: valores.memoria,
      fecha_inicio: valores.fecha_inicio,
      fecha_finalizacion: valores.fecha_finalizacion,
      id_cliente: valores.id_cliente
    };

    this.proyectoService.actualizar(id, proyectoActualizado).subscribe({
      next: (respuesta: any) => {
        this.proyecto = proyectoActualizado;
        this.proyectoService.proyectoSeleccionado = this.proyecto;

        this.editarProyecto.patchValue({
          titulo: this.proyecto.titulo,
          superficie: this.proyecto.superficie,
          ubicacion: this.proyecto.ubicacion,
          precio: this.proyecto.precio,
          nomenclatura: this.proyecto.nomenclatura,
          fecha_inicio: this.proyecto.fecha_inicio,
          fecha_finalizacion: this.proyecto.fecha_finalizacion,
          estado: this.proyecto.estado,
          descripcion: this.proyecto.descripcion,
          id_cliente: this.proyecto.id_cliente
        });

        this.cdr.detectChanges();

        Swal.fire({
          title: 'Proyecto actualizado',
          text: 'Los cambios se guardaron correctamente.',
          icon: 'success',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#2f6f7e'
        });

        console.log('Respuesta del servidor:', respuesta);
      },
      error: (error) => {
        console.error('Error al actualizar el proyecto:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el proyecto.',
          icon: 'error'
        });
      }
    });
  }
}