
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroService, DatosRegistro } from '../../services/registro-service';
import { RouterLink, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './registro.html',
})
export class RegistroComponent {

  formulario = new FormGroup({
    dni: new FormControl('', [
      Validators.required,//Verifica que el campo no esté vacío
      Validators.minLength(7),//Verifica que el campo tenga al menos 7 caracteres
      Validators.maxLength(8),//Verifica que el campo no tenga más de 8 caracteres
      Validators.pattern(/^[0-9-]+$/) //Verifica que el campo tenga solo numeros del 0 al 9
    ]),

    contra: new FormControl('', [
      Validators.required,//Verifica que el campo no esté vacío
      Validators.minLength(8),//Verifica que el campo tenga al menos 8 caracteres
      Validators.pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/)//Verifica que el campo contenga una mayúscula y un carácter especial
    ]),

    recordarme: new FormControl(false)
  });

  paso = 1;

  dni = '';
  contrasena = '';
  contrasena2 = '';
  nombre = '';

  mensaje = '';
  error = '';
  errorContrasena = '';
  enviando = false;
  mostrarContrasena = false;

  private registroService = inject(RegistroService);
  constructor(private router: Router, private detector: ChangeDetectorRef) { }

  registrarUsuario() {
    this.mensaje = '';
    this.error = '';
    this.errorContrasena = '';
    this.enviando = true;

    const datos: DatosRegistro = {
      dni: this.dni.trim(),
      contrasena: this.contrasena,
      nombre: this.nombre.trim()
    };

    this.registroService.registrar(datos).subscribe({
      next: () => {
        this.router.navigate(['/inicio']);

      },
      error: (err) => {
        this.error =
          err.error?.error || 'No se pudo registrar el usuario';
        console.error(err);
        return;
      },
    });
  }


  continuar() {
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    this.dni = this.formulario.controls.dni.value?.trim() ?? '';
    this.contrasena = this.formulario.controls.contra.value ?? '';

    if (this.contrasena !== this.contrasena2) {
      this.errorContrasena = 'Las contraseñas no coinciden';
      return;
    }

    this.errorContrasena = '';
    this.error = '';

    this.registroService.verificarDni(this.dni).subscribe({
      next: (respuesta) => {
        if (respuesta.existe) {
          this.error = 'Este DNI ya está registrado';
          this.detector.detectChanges();
          return;
        }

        this.error = '';
        this.paso = 2;
      },
      error: (err) => {
        this.error = 'No se pudo verificar el DNI';
        console.error(err);
      }
    });
  }


}
