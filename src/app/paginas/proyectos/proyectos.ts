
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProyectosService } from '../../services/proyectos';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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

  crearNuevoProyecto() {
    if (this.formNuevoProyecto.invalid) {
      this.formNuevoProyecto.markAllAsTouched();
      return;
    }

    const valores = this.formNuevoProyecto.value;

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
        this.formNuevoProyecto.reset();
      },
      error: (error) => {
        console.error('Error al crear el proyecto:', error);
        console.log('Respuesta del servidor:', error.error);
      }
    });
  }
}

