import { Component } from '@angular/core';
import {Location} from '@angular/common';
@Component({
  selector: 'app-preguntas-frecuentes',
  imports: [],
  templateUrl: './preguntas-frecuentes.html',
  styleUrl: './preguntas-frecuentes.css',
})
export class PreguntasFrecuentes {
  constructor(private location: Location) {}

  // Función para volver a la página anterior
  volverAtras() {
    this.location.back();
  }
}
