import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './paginas/home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-pasantia');
}
