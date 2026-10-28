
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProyectosService } from '../../services/proyectos';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proyectos',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css',
})
export class Proyectos implements OnInit {

  constructor(private proyectosService: ProyectosService, private cdr: ChangeDetectorRef) { }

  //ChangeDetectorRef: actualiza la vista de este componente, se utiliza cuando los datos llegan en un subscribe() y la vista no se actualiza aña

  proyectos: any[] = [];
  fotosSeleccionadas: File[] = [];

  enviandoProyecto = false;
  // nuevoProyecto = {
  //   titulo: '',
  //   ubicacion: '',
  //   superficie: '',
  //   precio: '',
  //   descripcion: '',
  //   nomenclatura: '',
  //   estado: '',
  //   memoria: '',
  //   fecha_inicio: '',
  //   fecha_finalizacion: ''
  // };

  formNuevoProyecto = new FormGroup({
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


  ngOnInit(): void {
    console.log('Se inicializó el componente Proyectos');

    this.proyectosService.listar().subscribe({ //se accede al metodo "listar()" del servicio "proyectosService" y se suscribe al Observable para recibir ña respuesta de esa peticion y manejar el resultado
      next: (respuesta: any) => {
        console.log('Respuesta de la API:', respuesta);

        this.proyectos = respuesta; //Se guarda lo recibido en el arreglo proyectos para poder mostrarlo en el html

        console.log('Proyectos cargados:', this.proyectos);

        // Avisar a Angular que debe actualizar la vista.
        this.cdr.markForCheck();
      },
      error: (error) => {//Si la peticion falla *dios quiera q no* se muestra el mensaje de error
        console.error('Error al obtener los proyectos:', error);
      }
    })


  }

  crearNuevoProyecto(): void {

    if (this.formNuevoProyecto.invalid) {
      this.formNuevoProyecto.markAllAsTouched();
      return;
    }

    if (this.enviandoProyecto) {
      return;
    }

    const valores = this.formNuevoProyecto.getRawValue();

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

    this.enviandoProyecto = true;

    this.proyectosService.crear(
      proyecto,
      this.fotosSeleccionadas
    ).subscribe({

      next: (respuesta) => {

        console.log('Proyecto creado:', respuesta);

        this.formNuevoProyecto.reset();
        this.fotosSeleccionadas = [];

        // Limpiar el selector de archivos.
        const input = document.getElementById('fotos') as HTMLInputElement | null;

        if (input) {
          input.value = '';
        }

        // Volver a consultar los proyectos.
        this.proyectosService.listar().subscribe({

          next: (respuesta: any[]) => {
            this.proyectos = respuesta;
            this.cdr.markForCheck();
          },

          error: (error) => {
            console.error('Error al actualizar los proyectos:', error);
          }

        });

        Swal.fire({
          title: '¡Proyecto cargado!',
          text: 'El proyecto y sus fotografías se enviaron correctamente.',
          icon: 'success'
        });

      },

      error: (error) => {

        console.error('Error HTTP:', error);
        console.error('Código de estado:', error.status);
        console.error('Respuesta del servidor:', error.error);

        Swal.fire({
          title: 'Error al crear el proyecto',
          text: error.error?.mensaje ||
            'No se pudo guardar el proyecto. Revisá la respuesta de la API.',
          icon: 'error'
        });

      },

      complete: () => {
        this.enviandoProyecto = false;
      }

    });
  }
  seleccionarFotos(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) {
      this.fotosSeleccionadas = [];
      return;
    }

    const archivos = Array.from(input.files);

    // Comprobar que todos los archivos sean imágenes.
    const archivosValidos = archivos.every((archivo) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)
    );

    if (!archivosValidos) {
      Swal.fire({
        title: 'Archivo no válido',
        text: 'Seleccioná únicamente imágenes JPG, PNG o WEBP.',
        icon: 'warning'
      });

      input.value = '';
      this.fotosSeleccionadas = [];
      return;
    }

    this.fotosSeleccionadas = archivos;
  }
  agregarPortfolio(id: number) {
    console.log('id del proyecto', id);


    this.proyectosService.agregarPortfolio(id).subscribe({
      next: (respuesta) => {
        console.log('Visualizacion cambiada:', respuesta);
        const proyecto = this.proyectos.find(p => p.id_obra === id);

        if (proyecto) {
          proyecto.visible_catalogo = Number(proyecto.visible_catalogo) === 1 ? 0 : 1;
          this.cdr.markForCheck();
          Swal.fire({
            title: "El proyecto ya esta en su Portfolio!",
            icon: "success",
            draggable: true
          });

          if (proyecto.visible_catalogo == 0) {
            Swal.fire({
              title: "Se quito el proyecto de Portfolio!",
              icon: "success",
              draggable: true
            });
          }
        }


      },
      error: (error) => {
        console.error('Error al cambiar visualizacion del proyecto:', error);
        console.log('Respuesta del servidor:', error.error);
      }
    })
  }


}

