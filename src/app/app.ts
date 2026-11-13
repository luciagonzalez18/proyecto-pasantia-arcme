
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { Menu } from './compartidos/menu/menu';
import { Footer } from './compartidos/footer/footer';
import Swal from 'sweetalert2';
import { ProyectosService } from './services/proyectos';
import { switchMap } from 'rxjs';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Footer, ReactiveFormsModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-pasantia');

  @ViewChild('memoriaInput') memoriaInput?: ElementRef<HTMLInputElement>;

  archivoMemoria: File | null = null;

  constructor(private proyectosService: ProyectosService) {
    // Detecta cuando cambia la página
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {

        // Comprueba si está en una página pública
        let paginaPublica = ['/home', '/inicioSesion', '/registro'].includes(event.urlAfterRedirects);

        // Recupera la preferencia guardada
        let modoOscuro = localStorage.getItem('modoOscuro') === 'true';

        // Las páginas públicas siempre quedan claras
        document.documentElement.classList.toggle(
          'modo-oscuro',
          modoOscuro && !paginaPublica
        );
      }

    });
  }
  router = inject(Router) // Inyecta el Router de Angular para poder acceder a la ruta actual de la aplicación.

  mostrarMenu(): boolean {
    return !['/home', '/inicioSesion', '/registro', '/configuracion', '/personalizacion', '/detalles-proyectos']
      .includes(this.router.url.split('/')[1] === 'detalles-proyectos'
        ? '/detalles-proyectos'
        : this.router.url);
  }

  ocultarBoton(): boolean {
    return !['/home', '/inicioSesion', '/registro', '/preguntas-frecuentes'].includes(this.router.url)
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
    descripcion: new FormControl('', [
      Validators.required
    ]),
  })

  seleccionarMemoria(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;

    if (!archivo) {
      this.archivoMemoria = null;
      return;
    }

    if (!archivo.name.toLowerCase().endsWith('.pdf')) {
      this.archivoMemoria = null;
      input.value = '';
      Swal.fire({
        title: 'Archivo no válido',
        text: 'La memoria debe ser un archivo PDF.',
        icon: 'error'
      });
      return;
    }

    this.archivoMemoria = archivo;
  }

  crearNuevoProyecto() {

    if (this.nuevoProyecto.invalid) {
      this.nuevoProyecto.markAllAsTouched();
      return;
    }

    if (!this.archivoMemoria) {
      Swal.fire({
        title: 'Falta la memoria',
        text: 'Seleccioná un archivo PDF.',
        icon: 'warning'
      });
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
      fecha_inicio: valores.fecha_inicio,
      fecha_finalizacion: valores.fecha_finalizacion
    };
    this.proyectosService.subirMemoria(this.archivoMemoria).pipe(
      switchMap((subida: any) => this.proyectosService.crear({
        ...proyecto,
        memoria: subida.memoria
      }))
    ).subscribe({
      next: (respuesta) => {
        console.log('Proyecto creado:', respuesta);
        this.nuevoProyecto.reset();
        this.archivoMemoria = null;

        if (this.memoriaInput) {
          this.memoriaInput.nativeElement.value = '';
        }

        Swal.fire({
          title: "Proyecto Cargado!",
          icon: "success"
        });

      },
      error: (error) => {
        console.error('Error al crear el proyecto:', error);
        console.log('Respuesta del servidor:', error.error);
        Swal.fire({
          title: 'Error al crear el proyecto',
          text: error.error?.error || 'No se pudo subir la memoria o guardar el proyecto.',
          icon: 'error'
        });
      }
    })
  }
  esConfiguracion(): boolean {
    return window.location.pathname === '/configuracion';
  }

  esPersonalizacion(): boolean {
    return window.location.pathname === '/personalizacion';
  }
}