import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InicioSesion } from './auth/inicio-sesion/inicio-sesion';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,InicioSesion],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-pasantia');
}
