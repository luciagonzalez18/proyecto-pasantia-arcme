import { Component, ElementRef, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProyectosService } from '../../services/proyectos';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { of, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles-proyecto',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './detalles-proyecto.html',
  styleUrl: './detalles-proyecto.css',
})
export class DetallesProyecto implements OnInit {
  proyecto: any = null;
  cargando = true;
  error = false;

  @ViewChild('memoriaInput') memoriaInput?: ElementRef<HTMLInputElement>;
  archivoMemoria: File | null = null

  constructor(
    private proyectoService: ProyectosService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Se ejecuta al entrar y cada vez que cambie el id en la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.cargarProyecto(id);
    });
  }

  cargarProyecto(id: any) {
    this.cargando = true;
    this.error = false;

    this.proyectoService.buscar(id).subscribe({
      next: (data: any) => {
        this.proyecto = Array.isArray(data) ? data[0] : data;
        this.proyectoService.proyectoSeleccionado = this.proyecto;
        this.rellenarFormulario();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el proyecto:', err);
        this.error = true;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  rellenarFormulario() {
    if (!this.proyecto) return;
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
    descripcion: new FormControl('', [Validators.required]),
  });

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

  tieneMemoria(memoria: string): boolean {
    return typeof memoria === 'string' && memoria.startsWith('uploads/');
  }

  nombreMemoria(memoria: string): string {
    if (!memoria) {
      return '';
    }

    return memoria.split(/[\\/]/).pop() || memoria;
  }

  Eliminar(id: number) {
    Swal.fire({
      title: '¿Deseas eliminar este proyecto?',
      text: 'Esta acción no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f6f7e',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, quiero borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminado',
          text: 'Tu proyecto ha sido eliminado.',
          icon: 'success'
        }).then(() => {
          this.proyectoService.eliminar(id).subscribe({
            next: (respuesta: any) => {
              console.log('Proyecto eliminado', respuesta);
              this.router.navigate(['/proyectos']);
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
      ...valores
    };
    const subida$ = this.archivoMemoria
      ? this.proyectoService.subirMemoria(this.archivoMemoria)
      : of({ memoria: this.proyecto.memoria });


    subida$.pipe(
      switchMap((subida: any) => {
        proyectoActualizado.memoria = subida.memoria;
        return this.proyectoService.actualizar(id, proyectoActualizado);
      })
    ).subscribe({
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

        this.archivoMemoria = null;

        if (this.memoriaInput) {
          this.memoriaInput.nativeElement.value = '';
        }

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
          text: error.error?.error || 'No se pudo actualizar el proyecto.',
          icon: 'error'
        });
      }
    });
  }
}