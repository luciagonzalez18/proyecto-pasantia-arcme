import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ProyectosService } from '../../services/proyectos';
import { ClientesService } from '../../services/clientes';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proyectos',
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css',
})
export class Proyectos implements OnInit {

  constructor(
    private proyectosService: ProyectosService,
    private clientesService: ClientesService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  proyectos: any[] = [];
  listaClientes: any[] = [];

  formNuevoProyecto = new FormGroup({
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
    id_cliente: new FormControl('', [Validators.required]) // <--- Acá elegís el cliente
  });

  ngOnInit(): void {
    this.cargarProyectos();
    this.cargarClientes();
  }

  cargarProyectos() {
    this.proyectosService.listar().subscribe({
      next: (respuesta: any) => {
        this.proyectos = respuesta;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al obtener los proyectos:', error);
      }
    });
  }

  cargarClientes() {
    this.clientesService.listar().subscribe({
      next: (respuesta: any) => {
        this.listaClientes = respuesta;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      }
    });
  }

  obtenerProyecto(id: number) {
    this.proyectosService.buscar(id).subscribe({
      next: (respuesta: any) => {
        this.proyectosService.proyectoSeleccionado = respuesta;
        this.router.navigate(['/detalles-proyectos']);
      },
      error: (error) => {
        console.error('Error al obtener el proyecto:', error);
      }
    });
  }

  crearNuevoProyecto(): void {
    if (this.formNuevoProyecto.invalid) {
      this.formNuevoProyecto.markAllAsTouched();
      return;
    }

    const proyecto = this.formNuevoProyecto.getRawValue();

    this.proyectosService.crear(proyecto).subscribe({
      next: (respuesta) => {
        this.cargarProyectos();
        this.formNuevoProyecto.reset();
        Swal.fire({
          title: "¡Proyecto Cargado!",
          icon: "success",
          confirmButtonColor: "#2f6f7e"
        });
      },
      error: (error) => {
        console.error('Error al crear el proyecto:', error);
        Swal.fire({
          title: 'Error al crear el proyecto',
          text: error.error?.error || 'No se pudo guardar el proyecto.',
          icon: 'error'
        });
      }
    });
  }

  agregarPortfolio(id: number) {
    this.proyectosService.agregarPortfolio(id).subscribe({
      next: (respuesta) => {
        const proyecto = this.proyectos.find(p => p.id_obra === id);
        if (proyecto) {
          proyecto.visible_catalogo = Number(proyecto.visible_catalogo) === 1 ? 0 : 1;
          this.cdr.markForCheck();
          Swal.fire({
            title: proyecto.visible_catalogo === 1 ? "¡Agregado al Portfolio!" : "¡Borrado del Portfolio!",
            icon: "success",
            confirmButtonText: "Continuar",
            confirmButtonColor: "#2f6f7e",
          });
        }
      },
      error: (error) => {
        console.error('Error al cambiar visualización:', error);
      }
    });
  }

  eliminarProyecto(id: number) {
    Swal.fire({
      title: "¿Deseas eliminar este proyecto?",
      text: "¡Esta acción no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2f6f7e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, quiero borrarlo!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.proyectosService.eliminar(id).subscribe({
          next: () => {
            this.cargarProyectos();
            Swal.fire({
              title: "¡Proyecto eliminado!",
              text: "Su proyecto fue eliminado con éxito",
              icon: "success",
              confirmButtonColor: "#2f6f7e"
            });
          },
          error: (error) => {
            console.error('Error al eliminar el proyecto:', error);
          }
        });
      }
    });
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
      case 'todos': this.nombreFiltro = 'Todos'; break;
      case 'recientes': this.nombreFiltro = 'Más recientes'; break;
      case 'antiguos': this.nombreFiltro = 'Más antiguos'; break;
      case 'az': this.nombreFiltro = 'De la A - Z'; break;
      case 'za': this.nombreFiltro = 'De la Z - A'; break;
    }
  }

  get proyectosFiltrados() {
    const texto = this.textoBusqueda.trim().toLowerCase();
    let resultado = this.proyectos.filter(p => p.titulo.toLowerCase().includes(texto));

    switch (this.ordenSeleccionado) {
      case 'recientes':
        resultado.sort((a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime());
        break;
      case 'antiguos':
        resultado.sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime());
        break;
      case 'az':
        resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'za':
        resultado.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
    }
    return resultado;
  }
}