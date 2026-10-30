import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio-service';
import { ProyectosService } from '../../services/proyectos';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-porfolio',
  imports: [],
  templateUrl: './porfolio.html',
  styleUrl: './porfolio.css',
})


export class Porfolio implements OnInit {
  proyectoPortfolio: any[] = []

  constructor(private portFolio: PortfolioService, private cdr: ChangeDetectorRef, private proyectoService: ProyectosService) { }
  ngOnInit(): void {
    this.listar()
  }

  listar() {
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

  quitarPortfolio(id: number) {
    const proyecto = this.proyectoPortfolio.find(p => p.id_obra === id);
    if (proyecto) {
      Swal.fire({
        title: "Seguro que desea quitar este proyeto del portfolio?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2f6f7e",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, quitar de portfolio",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) Swal.fire({
          title: "Eliminado del portfolio!",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#2f6f7e",
          icon: "success"
        }).then(() => {

          this.proyectoService.agregarPortfolio(id).subscribe({
            next: (respuesta: any) => {

              proyecto.visible_catalogo = Number(proyecto.visible_catalogo) === 1 ? 0 : 1;
              this.listar()
            }

          })
        })
      });

    }

  }
}

