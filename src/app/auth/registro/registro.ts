import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-registro',
  imports: [RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
<<<<<<< HEAD
  paso=1;
=======
  paso = 1;
  //el formulario no existe aun ,cuando se usa ngoninit (que ejecuta apenas entras a la pagina)
  //el formulario no se ejecuta al entrar en la pagina sino despues al dar click al boton
  //por eso usamos ngAfterViewInit que lo que hace  es ejecutar lo que pasaria despues del ng oninit
  //agarramos el div donde se encuentra el formulario con get Element by id
  validacionRegistro() {
    const dni = document.querySelector("#DNI-input") as any;
    const contrasena = document.getElementById("contrasena-input") as any;
    const contrasena2 = document.getElementById("contrasena2-input") as any;
   

    if (this.paso === 1) {
      if (dni.value === "" || dni.value.length !==7 && dni.value.length !==8) {
        alert("Ingrese un DNI valido");

        dni.value = ""
        contrasena.value = ""
        contrasena2.value = ""

        return

      } if (contrasena.value === "" || contrasena.value.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres");

        contrasena.value = ""
        dni.value = ""
        contrasena2.value = ""

        return
      } if (contrasena2.value !== contrasena.value) {
        alert("Las contraseñas no coinciden.");

        contrasena2.value = ""
        dni.value = ""
        contrasena.value = ""

        return
      }
    }

    this.paso = 2;
  }
   
  validacionRegistro2() {
 const nombre = document.getElementById("nombre") as any;

     if(nombre.value==="") {
      alert("Ingrese un nombre de usuario");
      return
    }
  }



>>>>>>> 59b1d9cd30da238234616917352454cccf49706c



}




