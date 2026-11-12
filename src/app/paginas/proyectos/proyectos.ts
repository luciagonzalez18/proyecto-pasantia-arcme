
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
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

  constructor(private proyectosService: ProyectosService, private cdr: ChangeDetectorRef, private router: Router) { }

  //ChangeDetectorRef: actualiza la vista de este componente, se utiliza cuando los datos llegan en un subscribe() y la vista no se actualiza aña

  proyectos: any[] = [];



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

    this.cargarProyectos();


  }
  cargarProyectos() {
    this.proyectosService.listar().subscribe({ //se accede al metodo "listar()" del servicio "proyectosService" y se suscribe al Observable para recibir ña respuesta de esa peticion y manejar el resultado
      next: (respuesta: any) => {
        console.log('Respuesta de la API:', respuesta);

        this.proyectos = respuesta;//Se guarda lo recibido en el arreglo proyectos para poder mostrarlo en el html


        // Avisar a Angular que debe actualizar la vista.
        this.cdr.markForCheck();
      },
      error: (error) => {//Si la peticion falla *dios quiera q no* se muestra el mensaje de error
        console.error('Error al obtener los proyectos:', error);
      }
    })
  }
  verDetalles(proyecto: any) {
    this.router.navigate(['/detalles-proyectos', proyecto.id_obra]);
  }

  crearNuevoProyecto(): void {

    if (this.formNuevoProyecto.invalid) {
      this.formNuevoProyecto.markAllAsTouched();
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


    this.proyectosService.crear(proyecto).subscribe({

      next: (respuesta) => {

        console.log('Proyecto creado:', respuesta);
        this.cargarProyectos()
        console.log('Proyectos después de crear:', this.proyectos);
        this.formNuevoProyecto.reset();
        Swal.fire({
          title: "Proyecto Cargado!",
          icon: "success",
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



    });
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
            title: "El proyecto se agrego a su Portfolio!",
            icon: "success",
            confirmButtonText: "Continuar",
            confirmButtonColor: "#2f6f7e",

          });

          if (proyecto.visible_catalogo == 0) {
            Swal.fire({
              title: "El proyecto se borro del Portfolio!",
              icon: "success",
              confirmButtonText: "Continuar",
              confirmButtonColor: "#2f6f7e",
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

  eliminarProyecto(id: number) {
    const proyecto = this.proyectos.find(p => p.id_obra === id);
    if (proyecto) {
      Swal.fire({
        title: "¿Deseas eliminar este proyecto?",
        text: "Esta acción no se puede revertir! ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2f6f7e",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, quiero borralo!",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) Swal.fire({
          title: "¡Proyecto eliminado!",
          confirmButtonText: "Continuar",
          text: "Su proyecto fue eliminado con exito",
          icon: "success",

        }).then(() => {
          this.proyectosService.eliminar(id).subscribe({

            next: (respuesta) => {
              this.cargarProyectos()

              console.log("proyecto eliminado", respuesta)
            },
            error: (error) => {
              console.error('Error al eliminar el proyecto:', error);
              console.log('Respuesta del servidor:', error.error);
            }
          })
        })

      });

    }

  }

  textoBusqueda: string = '';

  nombreFiltro: string = 'Filtrar';
  ordenSeleccionado: string = 'todos';

  buscarProyecto(event: Event) {
    const input = event.target as HTMLInputElement;
    this.textoBusqueda = input.value ?? '';
  }

  filtrarProyectos(opcion: string) {

    this.ordenSeleccionado = opcion;

    switch (opcion) {

      case 'todos':
        this.nombreFiltro = 'Todos';
        break;

      case 'recientes':
        this.nombreFiltro = 'Más recientes';
        break;

      case 'antiguos':
        this.nombreFiltro = 'Más antiguos';
        break;

      case 'az':
        this.nombreFiltro = 'De la A - Z';
        break;

      case 'za':
        this.nombreFiltro = 'De la Z - A';
        break;
    }
  }

  get proyectosFiltrados() {

    const texto = this.textoBusqueda.trim().toLowerCase();

    // Buscar proyectos por título
    let resultado = this.proyectos.filter(p => p.titulo.toLowerCase().includes(texto)
    );
    //p: representa cada proyecto que se está evaluando.
    //p.titulo: accede al título del proyecto.

    // Ordenar proyectos
    switch (this.ordenSeleccionado) {

      case 'recientes':
        resultado.sort((a, b) => //sort() metodo de javaScript para ordernar elementos de un array
          new Date(b.fecha_inicio).getTime() -  //(a, b): JavaScript va comparando los proyectos de a pares para determinar en qué orden deben quedar
          new Date(a.fecha_inicio).getTime()
          //se realiza una resta (b-a) para determinar el orden de los proyectos.
          //Si el resultado es negativo el proyecto A se coloca antes que el B.
          //Si el resultado es positivo el proyecto B se coloca antes que el A.
          //Si da cero, los considera iguales para el ordenamiento.
          //JavaScript utiliza su propio algoritmo de ordenamiento
        );
        break;

      case 'antiguos':
        resultado.sort((a, b) =>//(a, b) Parámetros de comparación
          new Date(a.fecha_inicio).getTime() -
          new Date(b.fecha_inicio).getTime()
        );
        break;

      case 'az':
        resultado.sort((a, b) =>
          a.titulo.localeCompare(b.titulo) //localeCompare() es un método de JavaScript que permite comparar dos textos alfabéticamente.
        );
        break;

      case 'za':

        resultado.sort((a, b) =>
          b.titulo.localeCompare(a.titulo)
        );
        break;
    }

    return resultado;
  }
}

