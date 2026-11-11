
import { Routes } from '@angular/router';

import { Home } from './paginas/home/home';
import { Inicio } from './paginas/inicio/inicio';
import { Proyectos } from './paginas/proyectos/proyectos';
import { RegistroComponent } from './auth/registro/registro';
import { InicioSesion } from './auth/inicio-sesion/inicio-sesion';
import { Proveedores } from './paginas/proveedores/proveedores';
import { Clientes } from './paginas/clientes/clientes';
import { Configuracion } from './paginas/configuracion/configuracion';
import { Personalizacion } from './paginas/personalizacion/personalizacion';
import { Porfolio } from './paginas/porfolio/porfolio';
import { Ingresos } from './paginas/ingresos/ingresos';
import { Agenda } from './paginas/agenda/agenda';
import { PreguntasFrecuentes } from './compartidos/preguntas-frecuentes/preguntas-frecuentes';
import { DetallesCliente } from './detalles/detalles-cliente/detalles-cliente';
import {DetallesProveedores} from './detalles/detalles-proveedores/detalles-proveedores';
import { DetallesProyecto } from './detalles/detalles-proyecto/detalles-proyecto';

// Importamos el Guard que comprueba si existe una sesión.
import { sesionGuard } from './auth/sesionguard';
export const routes: Routes = [

    // Redirige la ruta principal hacia inicio.
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },

    // Páginas privadas: necesitan una sesión activa.
    { path: "inicio", component: Inicio },
    { path: "proyectos", component: Proyectos },
    { path: "proveedores", component: Proveedores },
    { path: "clientes", component: Clientes },
    { path: "configuracion", component: Configuracion },
    { path: "personalizacion", component: Personalizacion },
    { path: "portfolio", component: Porfolio },
    { path: "ingresos", component: Ingresos },
    { path: "agenda", component: Agenda },
    { path: "porfolio", component: Porfolio },
    { path: "preguntas-frecuentes", component: PreguntasFrecuentes },
    { path: "detalles-proyectos",component:DetallesProyecto},
    { path: "detalles-clientes",component:DetallesCliente},
    { path: "detalles-proveedores",component:DetallesProveedores},

    // Páginas públicas: no necesitan una sesión.
    { path: "home", component: Home },
    { path: "registro", component: RegistroComponent },
    { path: "inicioSesion", component: InicioSesion },

    // Si la ruta no existe, redirige a inicio.
    { path: '**', redirectTo: 'inicio' }

];
