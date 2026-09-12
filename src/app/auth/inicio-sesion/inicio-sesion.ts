import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  imports: [RouterLink, CommonModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css',
})
export class InicioSesion {

  iniciarSesion() {
    alert("Usted ha iniciado sesion")
  }
  
}
