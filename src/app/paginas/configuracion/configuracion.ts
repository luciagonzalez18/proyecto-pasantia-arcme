
import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuracion',
  imports: [RouterLink, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {

  nombre: string = '';
  dni: string = '';
  correo: string = '';
  telefono: string = '';

  foto: string = '';
  fotoPreview: string = '';

  originales = {
    nombre: '',
    correo: '',
    telefono: ''
  };

  hayCambios: boolean = false;
  mensaje: string = '';
  error: string = '';

  constructor(private http: HttpClient, private detector: ChangeDetectorRef) {
  

    this.cargarPerfil();
  }

  // Obtiene los datos del usuario desde PHP
  cargarPerfil() {
  this.http.get<any>('/apiArcme/public/index.php/perfil').subscribe({
    next: (respuesta) => {
      this.nombre = respuesta.nombre || '';
      this.dni = respuesta.dni || '';
      this.correo = respuesta.correo || '';
      this.telefono = respuesta.telefono || '';

      if (respuesta.foto) {
        this.foto = '/apiArcme/public/' + respuesta.foto + '?t=' + new Date().getTime();
        this.fotoPreview = this.foto;
      } else {
        this.foto = '';
        this.fotoPreview = '';
      }

      this.guardarOriginales();

      // Actualiza visualmente los campos
      this.detector.detectChanges();
    },
    error: (err) => {
      this.error = 'No se pudieron cargar los datos del perfil';
      console.error(err);
    }
  });
}

  guardarOriginales() {
    this.originales = {
      nombre: this.nombre,
      correo: this.correo,
      telefono: this.telefono
    };

    this.hayCambios = false;
  }

  verificarCambios() {
    this.hayCambios =
      this.nombre !== this.originales.nombre ||
      this.correo !== this.originales.correo ||
      this.telefono !== this.originales.telefono;

    this.mensaje = '';
    this.error = '';
  }

  descartarCambios() {
    this.nombre = this.originales.nombre;
    this.correo = this.originales.correo;
    this.telefono = this.originales.telefono;

    this.hayCambios = false;
    this.mensaje = '';
    this.error = '';
  }

  guardarCambios() {
    if (this.nombre.trim() === '') {
      this.error = 'El nombre es obligatorio';
      return;
    }

    const datos = {
      nombre: this.nombre.trim(),
      correo: this.correo.trim(),
      telefono: this.telefono.trim()
    };

    this.http.put<any>('/apiArcme/public/index.php/perfil', datos).subscribe({
      next: (respuesta) => {
        this.nombre = datos.nombre;
        this.correo = datos.correo;
        this.telefono = datos.telefono;

        this.guardarOriginales();

        this.mensaje = respuesta.mensaje;
        this.error = '';
      },
      error: (err) => {
        this.error = err.error?.error || 'No se pudieron guardar los cambios';
      }
    });
  }

  // Selecciona y muestra una vista previa de la foto
 seleccionarFoto(evento: Event) {
  const input = evento.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const archivo = input.files[0];

  if (!archivo.type.startsWith('image/')) {
    this.error = 'Seleccioná un archivo de imagen';
    return;
  }

  if (archivo.size > 5 * 1024 * 1024) {
    this.error = 'La imagen no puede superar los 5 MB';
    return;
  }

  this.error = '';
  this.mensaje = '';

  // Lee y muestra la nueva imagen inmediatamente
  const lector = new FileReader();

  lector.onload = () => {
    this.fotoPreview = lector.result as string;
    this.detector.detectChanges();
  };

  lector.readAsDataURL(archivo);

  // Envía la nueva imagen a PHP
  const datos = new FormData();
  datos.append('foto', archivo);

  this.http.post<any>(
    '/apiArcme/public/index.php/perfil/foto',
    datos
  ).subscribe({
    next: (respuesta) => {
      this.foto = '/apiArcme/public/' + respuesta.foto + '?t=' + Date.now();
      this.fotoPreview = this.foto;

      this.mensaje = 'Foto actualizada correctamente';
      this.error = '';

      this.detector.detectChanges();
    },
    error: (err) => {
      this.error = err.error?.error || 'No se pudo subir la foto';
      this.fotoPreview = this.foto;

      this.detector.detectChanges();
    }
  });

  input.value = '';
}

}
