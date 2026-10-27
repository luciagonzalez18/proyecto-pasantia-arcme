import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegistroService } from '../../services/registro-service';
@Component({
  selector: 'app-registro',
  imports: [RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  paso = 1;



}




