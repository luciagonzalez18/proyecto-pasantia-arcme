import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Menu } from './compartidos/menu/menu';
import { Footer } from './compartidos/footer/footer';
import Swal from 'sweetalert2';
import { ProyectosService } from './services/proyectos';

import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Footer, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-pasantia');

  constructor(private proyectosService:ProyectosService){}
  router = inject(Router) // Inyecta el Router de Angular para poder acceder a la ruta actual de la aplicación.

  mostrarMenu(): boolean {
    return !['/home', '/inicioSesion', '/registro', '/configuracion', '/personalizacion'].includes(this.router.url)//retorna false cuando se encuetra en alguna de estas rutas, en cualquier otra retorna true
  }

  nuevoProyecto = new FormGroup({
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
  crearNuevoProyecto() {

    if (this.nuevoProyecto.invalid) {
      this.nuevoProyecto.markAllAsTouched();
      return;
    }
    const valores = this.nuevoProyecto.value;

    const proyecto = {
      titulo: valores.titulo,
      superficie: valores.superficie,
      ubicacion: valores.ubicacion,
      precio: valores.precio,
      descripcion: valores.descripcion,
      nomenclatura: valores.nomenclatura,
      estado: valores.estado,
      memoria: valores.memoria,
      fecha_inicio: valores.fecha_inicio,
      fecha_finalizacion: valores.fecha_finalizacion
    };
    this.proyectosService.crear(proyecto).subscribe({
      next: (respuesta) => {
              console.log('Proyecto creado:', respuesta);
              this.nuevoProyecto.reset();
              Swal.fire({
                title: "Proyecto Cargado!",
                icon: "success"
              });
             
            },
            error: (error) => {
              console.error('Error al crear el proyecto:', error);
              console.log('Respuesta del servidor:', error.error);
            }
    })
  }
}
