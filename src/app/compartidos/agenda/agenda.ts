import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

// interfaz donde está definido el evento y sus propiedades
export interface EventoAgenda {
  id: number;
  titulo: string;
  fecha: string;   // 'YYYY-MM-DD'
  hora: string;    // 'HH:mm'
  categoria: string;
  descripcion: string;
}

@Component({
  selector: 'app-agenda',
  imports: [ReactiveFormsModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda {
  //modal empieza en false cuando tocas el boton de nuevo evento cambia a true
@ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  // ---- datos del calendario ----

    //el arreglo eventos arranca vacío y es de tipo EventoAgenda
  eventos: EventoAgenda[] = [];         

  // guarda una fecha cualquiera del mes que se
  //esta viendo
  mesActual: Date = new Date();  

  //es la lista de casillas de la agenda  null es un casillero vacio               
  dias: (Date | null)[] = [];         

  //arreglo con los dias de la semana  
  nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

   Proximosevent:EventoAgenda[]=[];

  // validación de los campos del formulario de agregar evento
  eventoForm = new FormGroup({
    titulo: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    hora: new FormControl('', Validators.required),
    categoria: new FormControl('', Validators.required),
    descripcion: new FormControl('')
  });

  mensajeError: string = '';
// angular ejecuta una sola vez el metodo generarmes
  ngOnInit() {
    this.generarMes();
    this.actualizarProximos();
  }

  //logica del calendario


  // arma la lista de celdas del mes: primero las vacías, después los días
  generarMes() {
    //saca el año de mes actual
    const anio = this.mesActual.getFullYear();
    //y saca el mes de mesactual
    const mes = this.mesActual.getMonth();
    //cuenta los meses desde 0, osea enero es 0 y diciembre 11

    const cantidadDias = new Date(anio, mes + 1, 0).getDate();   // 28, 29, 30 o 31
    const celdasVacias = (new Date(anio, mes, 1).getDay() + 6) % 7;    // celdas vacías antes del día 1 (lunes primero)

    this.dias = [];
    for (let i = 0; i < celdasVacias; i++) this.dias.push(null);
    for (let d = 1; d <= cantidadDias; d++) this.dias.push(new Date(anio, mes, d));
  }




  // navegación: no hay límite de meses para adelante ni para atrás
  cambiarMes(n: number) {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + n, 1);
    this.generarMes();
  }

  irAHoy() {
    this.mesActual = new Date();
    this.generarMes();
  }

  // texto del encabezado, ej: "octubre de 2026"
  get tituloMes(): string {
    return this.mesActual.toLocaleDateString('es-AR', {day: 'numeric', month: 'long', year: 'numeric' });
  }

  esHoy(dia: Date): boolean {
    return this.fechaTexto(dia) === this.fechaTexto(new Date());
  }

  // busca los eventos de un día, ordenados por hora
  eventosDelDia(dia: Date): EventoAgenda[] {
    const fechaStr = this.fechaTexto(dia);
    return this.eventos

    // filtra todos los eventos que son del mismo dia y los muestra en su casilla
    //correspondiente
      .filter(ev => ev.fecha === fechaStr)
      //sort es para ordenar compara dos objetos a y b
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  // convierte una fecha en el formato dia-mes-año
  fechaTexto(fecha: Date): string {
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0')// padstart asegura q tenga dos caracteres si tiene uno pone un 0
    const dd = String(fecha.getDate()).padStart(2, '0');// adelante por ejemplo 01/09
    return `${yyyy}-${mm}-${dd}`;
  }

  // ---- modal y alta de eventos ----

  // si viene un día (clic en una celda) la fecha queda cargada en el formulario
  abrirModal(dia?: Date) {
    this.mensajeError = '';
    this.eventoForm.reset({
      titulo: '',
      fecha: dia ? this.fechaTexto(dia) : '',
      hora: '',
      categoria: '',
      descripcion: ''
    });
    this.modal.nativeElement.showModal();
  }

  cerrarModal() {
    this.modal.nativeElement.close();
  }
//aca abajo esta la logica que crea y  agrega el evento al formulario
  agregarEvento() {
    if (this.eventoForm.invalid) {
      this.mensajeError = 'Por favor completá todos los campos obligatorios';
      return;
    }

    this.mensajeError = '';

    const valores = this.eventoForm.value;
    const nuevoEvento: EventoAgenda = {
      id: Date.now(),
      titulo: valores.titulo ?? '',
      fecha: valores.fecha ?? '',
      hora: valores.hora ?? '',
      categoria: valores.categoria ?? '',
      descripcion: valores.descripcion ?? ''
    };

    this.eventos.push(nuevoEvento);
    this.actualizarProximos();

    // si el evento es de otro mes, mostramos ese mes para que se vea
    const [anio, mes] = nuevoEvento.fecha.split('-').map(Number);
    this.mesActual = new Date(anio, mes - 1, 1);
    this.generarMes();

    this.cerrarModal();
  }

  eliminar(id: number, e: Event) {
    e.stopPropagation(); // evita que se abra el modal al borrar
    this.eventos = this.eventos.filter(ev => ev.id !== id);
    this.actualizarProximos();
  }


  // guarda en Proximosevent los eventos de hoy en adelante, ordenados


// pasa "2026-10-16" a "16/10/2026" para mostrarlo
formatoFecha(fecha: string): string {
  return fecha.split('-').reverse().join('/');
}

//logica del filtro por categoria 
filtroCategoria: string = '';

filtrar(e: Event) {
  this.filtroCategoria = (e.target as HTMLSelectElement).value;
  this.actualizarProximos();
}

actualizarProximos() {
  const hoy = this.fechaTexto(new Date());

  this.Proximosevent = this.eventos
    .filter(ev => ev.fecha >= hoy)
    .filter(ev => this.filtroCategoria === '' || ev.categoria === this.filtroCategoria)
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
}





}
