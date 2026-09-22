import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css'
})



export class InicioSesion {

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


  iniciarSesion() {

    // Marca todos los campos como tocados
    this.formulario.markAllAsTouched();

    // Si hay algún campo inválido, no continúa
    if (this.formulario.invalid) {
      return;
    }

    console.log('Formulario válido');
    console.log(this.formulario.value);

    // Acá después iría la lógica para iniciar sesión
  }
}