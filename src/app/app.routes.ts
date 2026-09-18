import { Routes } from '@angular/router';
import { Home } from './paginas/home/home';
import { Registro } from './auth/registro/registro';
import { InicioSesion } from './auth/inicio-sesion/inicio-sesion';
import {Proveedores} from './paginas/proveedores/proveedores';
import {Clientes} from './paginas/clientes/clientes';
import {PreguntasFrecuentes} from './compartidos/preguntas-frecuentes/preguntas-frecuentes';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    { path: "home", component: Home },
    { path: "registro", component: Registro },
    { path: "inicioSesion",component:InicioSesion},
    {path: "proveedores", component: Proveedores},
    {path: "clientes", component: Clientes},
    {path: "preguntas-frecuentes", component: PreguntasFrecuentes},
    { path: '**', redirectTo: 'home' }

];
