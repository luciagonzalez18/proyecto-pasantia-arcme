
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css'
})

export class InicioSesion {

  formulario = new FormGroup({
    dni: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(8),
      Validators.pattern(/^[0-9-]+$/)
    ]),

    contra: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/)
    ]),

    recordarme: new FormControl(false)
  });

  errorDni = '';
  errorContrasena = '';

  constructor(private http: HttpClient, private router: Router, private detector: ChangeDetectorRef) {
      this.verificarSesion();
  }

  iniciarSesion() {

    this.errorDni = '';
    this.errorContrasena = '';

    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    const datos = {
      dni: this.formulario.value.dni,
      contrasena: this.formulario.value.contra
    };

    this.http.post(
      '/apiArcme/public/index.php/login',
      datos
    ).subscribe({
      next: () => {
        this.router.navigate(['/inicio']);
      },

      error: (err) => {
        this.errorContrasena =
          err.error?.error || 'No se pudo iniciar sesión';
          this.detector.detectChanges();
      }
    });
    
  }

  verificarSesion() {

  this.http.get<{sesion: boolean}>(
    '/apiArcme/public/index.php/verificar-sesion'
  ).subscribe({
    next: (respuesta) => {

      if (respuesta.sesion) {
        this.router.navigate(['/inicio']);
      }

    },
    error: (err) => {
      console.error(err);
    }
  });

}

}


