import { Routes } from '@angular/router';
import { Home } from './paginas/home/home';
import { Registro } from './auth/registro/registro';
import { InicioSesion } from './auth/inicio-sesion/inicio-sesion';
import { Configuracion } from './paginas/configuracion/configuracion';
import { Personalizacion } from './paginas/personalizacion/personalizacion';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    { path: "home", component: Home },
    { path: "registro", component: Registro },
    { path: "inicioSesion",component:InicioSesion},
    {path:"configuracion",component:Configuracion},
    {path:"personalizacion",component:Personalizacion},
    { path: '**', redirectTo: 'home' }

];
