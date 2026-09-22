import { Routes } from '@angular/router';
import { Home } from './paginas/home/home';
import { Registro } from './auth/registro/registro';
import { InicioSesion } from './auth/inicio-sesion/inicio-sesion';
import { Agenda } from './compartidos/agenda/agenda';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    { path: "home", component: Home },
    { path: "registro", component: Registro },
    { path: "inicioSesion",component:InicioSesion},
    {path: "agenda" , component: Agenda},

    { path: '**', redirectTo: 'home' }

];
