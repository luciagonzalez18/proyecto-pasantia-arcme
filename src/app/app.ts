
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
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

  router = inject(Router);

  mostrarMenu(): boolean {
    return !['/home', '/inicioSesion', '/registro', '/configuracion', '/personalizacion'].includes(this.router.url);
  }

  constructor() {

    // Detecta cuando cambia la página
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {

        // Comprueba si está en una página pública
        let paginaPublica = ['/home', '/inicioSesion', '/registro'].includes(event.urlAfterRedirects);

        // Recupera la preferencia guardada
        let modoOscuro = localStorage.getItem('modoOscuro') === 'true';

        // Las páginas públicas siempre quedan claras
        document.documentElement.classList.toggle(
          'modo-oscuro',
          modoOscuro && !paginaPublica
        );
      }

    });

  }

  esConfiguracion(): boolean {
    return window.location.pathname === '/configuracion';
  }

  esPersonalizacion(): boolean {
    return window.location.pathname === '/personalizacion';
  }
}
