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
import { PreguntasFrecuentes } from './compartidos/preguntas-frecuentes/preguntas-frecuentes';
import { DetallesCliente } from './detalles/detalles-cliente/detalles-cliente';
import {DetallesProveedores} from './detalles/detalles-proveedores/detalles-proveedores';
import { DetallesProyecto } from './detalles/detalles-proyecto/detalles-proyecto';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
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
    { path: "agenda", component: Agenda },
    { path: "porfolio", component: Porfolio },
    { path: "preguntas-frecuentes", component: PreguntasFrecuentes },
    { path: "ingresos", component: Ingresos },
    { path: "detalles-proveedores", component: DetallesProveedores },
    { path: "detalles-clientes", component: DetallesCliente },
    { path: "detalles-proyectos", component: DetallesProyecto },
    { path: '**', redirectTo: 'home' }

];
