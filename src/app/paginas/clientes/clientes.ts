import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes';
import { CommonModule } from '@angular/common'; // Asegúrate de tener CommonModule si usas pipes o directivas comunes
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  constructor(private ClientesService: ClientesService, private cdr: ChangeDetectorRef, private router: Router) { }

  clientes: any[] = [];
  clientesOriginales: any[] = []; // Guardamos la lista completa para poder filtrar/resetear

  formNuevoCliente = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    console.log('Se inicializó el componente Clientes');
    this.cargarClientes();
  }

  cargarClientes() {
    this.ClientesService.listar().subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta de la API:', respuesta);
        this.clientesOriginales = respuesta;
        this.clientes = [...this.clientesOriginales];
        this.aplicarFiltrosYOrden(); // Aplicamos los filtros actuales por si había alguno activo
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error HTTP completo:', error);
        
        const detalle = error.error;
        let mensajeError = detalle?.error || error.message || 'Error desconocido';
        
        if (detalle?.uri_analizada) {
          mensajeError += `\nURI: ${detalle.uri_analizada}\nSegmentos: ${JSON.stringify(detalle.segmentos)}`;
        }

        Swal.fire({
          title: 'Error al cargar los clientes',
          text: mensajeError,
          icon: 'error'
        });
      }
    });
  }

  obtenerCliente(id: number) {
    this.ClientesService.buscar(id).subscribe({
      next: (respuesta: any) => {
        this.ClientesService.clienteSeleccionado = respuesta;
        console.log("cliente obtenido", respuesta);
        this.router.navigate(['/detalles-clientes']);
      },
      error: (error) => {
        console.error('Error al obtener el cliente:', error);
      }
    });
  }

  AgregarCliente(): void {
    if (this.formNuevoCliente.invalid) {
      this.formNuevoCliente.markAllAsTouched();
      return;
    }

    const valores = this.formNuevoCliente.getRawValue();

    const cliente = {
      nombre: valores.nombre,
      telefono: valores.telefono,
      direccion: valores.direccion,
      ciudad: valores.ciudad
    };

    this.ClientesService.crear(cliente).subscribe({
      next: (respuesta) => {
        console.log('Cliente creado:', respuesta);
        this.cargarClientes();
        this.formNuevoCliente.reset();
        Swal.fire({
          title: "¡Cliente Creado!",
          icon: "success",
        });
      },
      error: (error) => {
        console.error('Error HTTP:', error);
        Swal.fire({
          title: 'Error al crear el cliente',
          text: error.error?.mensaje || 'No se pudo guardar el cliente. Revisá la respuesta de la API.',
          icon: 'error'
        });
      },
    });
  }

  eliminarCliente(id: number) {
    const cliente = this.clientesOriginales.find(c => c.id_cliente === id);
    if (cliente) {
      Swal.fire({
        title: "¿Deseas eliminar este cliente?",
        text: "¡Esta acción no se puede revertir!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2f6f7e",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, quiero borrarlo!",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.ClientesService.eliminar(id).subscribe({
            next: (respuesta) => {
              this.cargarClientes();
              console.log("cliente eliminado", respuesta);
              Swal.fire({
                title: "¡Cliente eliminado!",
                text: "Su cliente fue eliminado con éxito",
                icon: "success",
                confirmButtonText: "Continuar"
              });
            },
            error: (error) => {
              console.error('Error al eliminar el cliente:', error);
            }
          });
        }
      });
    }
  }

  textoBusqueda: string = '';
  nombreFiltroCiudad: string = 'todos';
  ordenSeleccionado: string = 'az';

  buscarCliente(event: Event) {
    const input = event.target as HTMLInputElement;
    this.textoBusqueda = input.value ? input.value.toLowerCase() : '';
    this.aplicarFiltrosYOrden();
  }

  filtrarClientes(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const valor = selectElement.value;

    // Identificamos si el select modificado corresponde a ordenamiento o a ciudad
    if (valor === 'az' || valor === 'za' || valor === 'fechaDeRegistro') {
      this.ordenSeleccionado = valor;
    } else {
      this.nombreFiltroCiudad = valor;
    }

    this.aplicarFiltrosYOrden();
  }

  // NUEVO: Método centralizado para filtrar por texto, ciudad y ordenar la tabla dinámicamente
  aplicarFiltrosYOrden() {
    let resultado = [...this.clientesOriginales];

    // 1. Filtrar por texto de búsqueda (nombre)
    if (this.textoBusqueda.trim() !== '') {
      resultado = resultado.filter(c => c.nombre && c.nombre.toLowerCase().includes(this.textoBusqueda));
    }

    // 2. Filtrar por ciudad
    if (this.nombreFiltroCiudad !== 'todos') {
      resultado = resultado.filter(c => c.ciudad === this.nombreFiltroCiudad);
    }

    // 3. Ordenar resultados
    resultado.sort((a, b) => {
      if (this.ordenSeleccionado === 'az') {
        return (a.nombre || '').localeCompare(b.nombre || '');
      } else if (this.ordenSeleccionado === 'za') {
        return (b.nombre || '').localeCompare(a.nombre || '');
      } else if (this.ordenSeleccionado === 'fechaDeRegistro') {
        // Asumiendo que existe un campo id o fecha de registro (ej. id_cliente descendiente)
        return (b.id_cliente || 0) - (a.id_cliente || 0);
      }
      return 0;
    });

    this.clientes = resultado;
  }
}