import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProyectosService } from '../../services/proyectos';

@Component({
  selector: 'app-proyectos',
  imports: [RouterLink],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css',
})
export class Proyectos implements OnInit {

  private proyectosService = inject(ProyectosService);

  proyectos: any[] = [];

  ngOnInit(): void {
    this.proyectosService.listar().subscribe({
      next: (respuesta: any) => {
        this.proyectos = respuesta;
        console.log('Proyectos recibidos:', this.proyectos);
      },
      error: (error) => {
        console.error('Error al obtener los proyectos:', error);
      }
    });
  }

  crearProyecto(){
    
  }
}