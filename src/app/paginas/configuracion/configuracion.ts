import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-configuracion',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {

    formulario = new FormGroup({
      nombre: new FormControl('', [

        Validators.required,
        Validators.maxLength(12),//Verifica que el campo no tenga más de 12 caracteres
      ]
      ),

      correo: new FormControl('', [
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) //Verifica que el campo tenga un formato de correo válido
      ]),

      telefono: new FormControl('',[
        Validators.minLength(10),//Verifica que el campo tenga al menos 10 caracteres
        Validators.pattern(/^[0-9]+$/) //Verifica que el campo tenga solo numeros del 0 al 9
      ])
    });
  

  onSubmit() {
    if (this.formulario.valid) {
      console.log(this.formulario.value);
    }
  }
}
