import { Routes } from '@angular/router';
import { Home } from './paginas/home/home';
import { Inicio } from './paginas/inicio/inicio';
import { Proyectos } from './paginas/proyectos/proyectos';
import { Registro } from './auth/registro/registro';
import { InicioSesion } from './auth/inicio-sesion/inicio-sesion';
import { Proveedores } from './paginas/proveedores/proveedores';
import { Clientes } from './paginas/clientes/clientes';
import { Configuracion } from './paginas/configuracion/configuracion';
import { Personalizacion } from './paginas/personalizacion/personalizacion';
import { Porfolio } from './paginas/porfolio/porfolio';
import { Ingresos } from './paginas/ingresos/ingresos';
import { Agenda } from './compartidos/agenda/agenda';
import { Porfolio } from './paginas/porfolio/porfolio';
import { PreguntasFrecuentes } from './compartidos/preguntas-frecuentes/preguntas-frecuentes';
import { Ingresos } from './paginas/ingresos/ingresos';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: "inicio", component: Inicio },
    { path: "proyectos", component: Proyectos },
    { path: "home", component: Home },
    { path: "registro", component: Registro },
    { path: "inicioSesion", component: InicioSesion },
    { path: "proveedores", component: Proveedores },
    { path: "clientes", component: Clientes },
    { path: "configuracion", component: Configuracion },
    { path: "personalizacion", component: Personalizacion },
    { path: "portfolio", component: Porfolio },
    { path: "ingresos", component: Ingresos },
    { path: "agenda", component: Agenda },
    { path: "porfolio", component: Porfolio },
    {path: "preguntas-frecuentes", component: PreguntasFrecuentes },
    {path: "ingresos", component: Ingresos },
    { path: "preguntas-frecuentes", component: PreguntasFrecuentes },
    { path: '**', redirectTo: 'inicio' }

];
