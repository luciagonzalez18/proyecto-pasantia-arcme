import { AfterViewInit, Component, input} from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-registro',
  imports: [RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements AfterViewInit{
  paso=1;
//el formulario no existe aun ,cuando se usa ngoninit (que ejecuta apenas entras a la pagina)
//el formulario no se ejecuta al entrar en la pagina sino despues al dar click al boton
//por eso usamos ngAfterViewInit que lo que hace  es ejecutar lo que pasaria despues del ng oninit
ngAfterViewInit() {
  //agarramos el div donde se encuentra el formulario con get Element by id

  //agarramos el formulario de nuestro documento HTML llamado "formulario"

// const formulario = document.getElementById("formulario-registro");

//en una variable llamada inputs agarramos todos los inputs del form de 
  // registro con el metodo querySelectorAll

// const inputs = document.querySelectorAll('input');

const dni = document.querySelector("#DNI-input") as any;
const contrasena = document.getElementById("contrasena-input") as any;
const contrasena2 = document.getElementById("contrasena2-input") as any;

if(dni.value === "") {
alert("error")
}
}
  
    
  
  

 // if(this.inputs=="") {

  //}
  }


  

