import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ProyectosService } from '../../services/proyectos';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-detalles-proyecto',
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './detalles-proyecto.html',
  styleUrl: './detalles-proyecto.css',
})
export class DetallesProyecto implements OnInit {
  constructor(private proyectoService: ProyectosService, private router: Router, private cdr: ChangeDetectorRef) { }
  proyecto: any = null
  ngOnInit(): void {

    this.proyectoCargado()

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
        descripcion: this.proyecto.descripcion,
      });
    }
  }
  proyectoCargado() {
    this.proyecto = this.proyectoService.proyectoSeleccionado
    this.cdr.markForCheck();
    console.log(this.proyectoService.proyectoSeleccionado)
  }

  editarProyecto = new FormGroup({
    titulo: new FormControl('', [
      Validators.required
    ]),
    superficie: new FormControl('', [
      Validators.required
    ]),
    ubicacion: new FormControl('', [
      Validators.required
    ]),
    precio: new FormControl('', [
      Validators.required
    ]),
    nomenclatura: new FormControl('', [
      Validators.required
    ]),
    fecha_inicio: new FormControl('', [
      Validators.required
    ]),
    fecha_finalizacion: new FormControl('', [
      Validators.required
    ]),
    estado: new FormControl('', [
      Validators.required
    ]),
    memoria: new FormControl('', [
      Validators.required
    ]),
    descripcion: new FormControl('', [
      Validators.required
    ]),
  })
  Eliminar(id: number) {
    Swal.fire({
      title: "¿Deseas eliminar este proyecto?",
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
        text: "Tu proyecto ha sido eliminado.",
        icon: "success"
      }).then(() => {
        this.proyectoService.eliminar(id).subscribe({
          next: (respuesta: any) => {
            this.router.navigate(['/proyectos'])
            console.log("Proyecto eliminado", respuesta)
          }
        })

      })
    })
  }

  modificarProyecto(id: number) {
    if (this.editarProyecto.invalid) {
      this.editarProyecto.markAllAsTouched();
      return;
    }

    const valores = this.editarProyecto.getRawValue();

    const proyectoActualizado = {
      ...this.proyecto,// ... :Se utilizan para copiar o expandir las propiedades de un objeto dentro de otro.
      titulo: valores.titulo,
      superficie: valores.superficie,
      ubicacion: valores.ubicacion,
      precio: valores.precio,
      descripcion: valores.descripcion,
      nomenclatura: valores.nomenclatura,
      estado: valores.estado,
      memoria:valores.memoria,
      fecha_inicio: valores.fecha_inicio,
      fecha_finalizacion: valores.fecha_finalizacion
    };

    this.proyectoService.actualizar(id, proyectoActualizado).subscribe({
      next: (respuesta: any) => {
        // Actualizamos los datos que muestra la página.
        this.proyecto = proyectoActualizado;

        // Actualizamos el objeto compartido por el servicio.
        this.proyectoService.proyectoSeleccionado = this.proyecto;

        // Actualizamos los campos del formulario.
        this.editarProyecto.patchValue({
          titulo: this.proyecto.titulo,
          superficie: this.proyecto.superficie,
          ubicacion: this.proyecto.ubicacion,
          precio: this.proyecto.precio,
          nomenclatura: this.proyecto.nomenclatura,
          fecha_inicio: this.proyecto.fecha_inicio,
          fecha_finalizacion: this.proyecto.fecha_finalizacion,
          estado: this.proyecto.estado,
          descripcion: this.proyecto.descripcion
        });

        this.cdr.detectChanges();

        Swal.fire({
          title: 'Proyecto actualizado',
          text: 'Los cambios se guardaron correctamente.',
          icon: 'success',
          confirmButtonText:'Continuar',
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
