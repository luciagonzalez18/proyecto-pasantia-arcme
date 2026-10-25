import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-ingresos',
  imports: [CommonModule, FormsModule],
  templateUrl: './ingresos.html',
  styleUrl: './ingresos.css',
})
export class Ingresos {
  clienteBusqueda: string = "";
}
