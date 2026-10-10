import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Menu } from './compartidos/menu/menu';
import { Footer } from './compartidos/footer/footer';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-pasantia');


  router = inject(Router) // Inyecta el Router de Angular para poder acceder a la ruta actual de la aplicación.

  mostrarMenu(): boolean {
    return !['/home', '/inicioSesion', '/registro','/configuracion','personalizacion'].includes(this.router.url)//retorna false cuando se encuetra en alguna de estas rutas, en cualquier otra retorna true
  }
}
