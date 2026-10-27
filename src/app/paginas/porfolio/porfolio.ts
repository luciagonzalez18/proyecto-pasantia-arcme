import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio-service';
@Component({
  selector: 'app-porfolio',
  imports: [],
  templateUrl: './porfolio.html',
  styleUrl: './porfolio.css',
})


export class Porfolio implements OnInit {
  proyectoPortfolio: any[] = []

  constructor(private portFolio: PortfolioService, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.portFolio.listarPortfolio().subscribe({ //se accede al metodo "listarPortFolio()" del servicio "portFolioService" y se suscribe al Observable para recibir ña respuesta de esa peticion y manejar el resultado
      next: (respuesta: any) => {
        console.log('Respuesta de la API:', respuesta);

        this.proyectoPortfolio = respuesta; //Se guarda lo recibido en el arreglo portFolio para poder mostrarlo en el html

        console.log('portFolio cargado:', this.proyectoPortfolio);

        // Avisar a Angular que debe actualizar la vista.
        this.cdr.markForCheck();
      },
      error: (error) => {//Si la peticion falla *dios quiera q no* se muestra el mensaje de error
        console.error('Error al obtener los proyectos de portFolio:', error);
      }
    })
  }
}


