import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
// le pusimos otro nombre al servicio para que no se confunda con la clase Agenda de abajo
import { Agenda as AgendaService } from '../../servicios/agenda';

@Component({
  selector: 'app-agenda',
  imports: [ReactiveFormsModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda implements OnInit {

  //injectamos el sevicio
  private agendaServicios = inject(AgendaService);

  // angular ejecuta una sola vez este metodo al cargar el componente
  ngOnInit() {
    this.generarMes();
    this.cargarEventos();
  }

  //agarra el modal del html y lo guarda en una variable del ts
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  

  // un arreglo de eventos de tipo any ( el any indica q puede ser cualquier cosa)
  eventos: any[] = [];

  // guarda una fecha cualquiera del mes que se esta viendo
  mesActual: Date = new Date();

  // es la lista de casillas de la agenda, null es un casillero vacio
  dias: (Date | null)[] = [];

  //arreglo con los dias de la semana
  nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  //arreglo de proximos eventos
  Proximosevent: any[] = [];

  // validación de los campos del formulario de agregar evento
  eventoForm = new FormGroup({
    titulo: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    hora: new FormControl('', Validators.required),
    categoria: new FormControl('', Validators.required),
    descripcion: new FormControl('')
  });

  mensajeError: string = '';

  //  guarda el id del evento que estamos editando (null = estamos creando uno nuevo)
  idEditando: number | null = null;

  //  conexión con la API 

  // le pide a la API todos los eventos y los guarda en la lista
  cargarEventos() {
    this.agendaServicios.listar().subscribe({
      next: (datos) => {
        // MySQL manda la hora como "10:00:00", la recortamos a "10:00"
        this.eventos = datos.map(ev => ({ ...ev, hora: ev.hora.slice(0, 5) }));
        this.actualizarProximos();
      },
      error: (err) => console.error('Error al cargar eventos', err)
    });
  }

  //logica del calendario

  // arma la lista de celdas del mes: primero las vacías, después los días
  generarMes() {
    const anio = this.mesActual.getFullYear();
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
    return this.mesActual.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  }

  esHoy(dia: Date): boolean {
    return this.fechaTexto(dia) === this.fechaTexto(new Date());
  }

  // busca los eventos de un día, ordenados por hora
  eventosDelDia(dia: Date): any[] {
    const fechaStr = this.fechaTexto(dia);
    return this.eventos
      .filter(ev => ev.fecha === fechaStr)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  // convierte una fecha en el formato año-mes-dia
  fechaTexto(fecha: Date): string {
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  //  modal 

  // si viene un día (clic en una celda) la fecha queda cargada en el formulario
  abrirModal(dia?: Date) {
    this.idEditando = null;   //  al crear, nos aseguramos de no estar editando
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

  // arma el evento y se lo manda a la API para que lo guarde en la base
  agregarEvento() {
    if (this.eventoForm.invalid) {
      this.mensajeError = 'Por favor completá todos los campos obligatorios';
      return;
    }

    this.mensajeError = '';

    const valores = this.eventoForm.value;
    // ya no ponemos id: lo genera la base de datos solo
    const nuevoEvento = {
      titulo: valores.titulo ?? '',
      fecha: valores.fecha ?? '',
      hora: valores.hora ?? '',
      categoria: valores.categoria ?? '',
      descripcion: valores.descripcion ?? ''
    };

    //  si estamos editando mandamos la modificación, si no, creamos uno nuevo
    const pedido = this.idEditando
      ? this.agendaServicios.editar(this.idEditando, nuevoEvento)
      : this.agendaServicios.crear(nuevoEvento);

    // sin el subscribe el pedido NUNCA se envía
    pedido.subscribe({
      next: () => {
        // si el evento es de otro mes, mostramos ese mes para que se vea
        const [anio, mes] = nuevoEvento.fecha.split('-').map(Number);
        this.mesActual = new Date(anio, mes - 1, 1);
        this.generarMes();

        // volvemos a pedir la lista para que aparezca el evento nuevo
        this.cargarEventos();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al guardar el evento', err);
        this.mensajeError = 'No se pudo guardar el evento';
      }
    });
  }

  //  abre el modal con los datos del evento para poder modificarlos
  editar(ev: any) {
    this.idEditando = ev.id_evento;
    this.mensajeError = '';
    this.eventoForm.setValue({
      titulo: ev.titulo,
      fecha: ev.fecha,
      hora: ev.hora,
      categoria: ev.categoria,
      descripcion: ev.descripcion ?? ''
    });
    this.modal.nativeElement.showModal();
  }

  // borra el evento primero lo saca de la pantalla y después lo borra en la base
  eliminar(id: number, e: Event) {
    e.stopPropagation(); // evita que se abra el modal al borrar

    // lo sacamos de la lista al instante (!= porque PHP manda el id como texto)
    this.eventos = this.eventos.filter(ev => ev.id_evento != id);
    this.actualizarProximos();

    this.agendaServicios.eliminar(id).subscribe({
      next: () => this.cargarEventos(),
      error: (err) => {
        console.error('Error al eliminar el evento', err);
        this.cargarEventos();
      }
    });
  }

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
    const hoy = new Date();
    const hoyStr = this.fechaTexto(hoy);

    const semana = new Date();
    semana.setDate(hoy.getDate() + 7);
    const semanaStr = this.fechaTexto(semana);

    this.Proximosevent = this.eventos
      .filter(ev => ev.fecha >= hoyStr && ev.fecha <= semanaStr)
      .filter(ev => this.filtroCategoria === '' || ev.categoria === this.filtroCategoria)
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  }

}