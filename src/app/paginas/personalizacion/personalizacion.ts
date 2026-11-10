
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-personalizacion',
  imports: [RouterLink],
  templateUrl: './personalizacion.html',
  styleUrl: './personalizacion.css',
})
export class Personalizacion {

  modoOscuro: boolean = false;

  constructor() {

    // Recupera la configuración guardada
    this.modoOscuro = localStorage.getItem('modoOscuro') === 'true';

    // Aplica el modo guardado
    this.aplicarModoOscuro();

  }

  alternarModoOscuro() {

    this.modoOscuro = !this.modoOscuro;

    // Guarda la elección
    localStorage.setItem('modoOscuro', String(this.modoOscuro));

    // Aplica el cambio
    this.aplicarModoOscuro();

  }

  aplicarModoOscuro() {

    document.documentElement.classList.toggle(
      'modo-oscuro',
      this.modoOscuro
    );

  }

}
