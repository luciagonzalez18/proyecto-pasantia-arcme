import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//bug arreglar el boton de agregar al portfolio al crear el proyecto 
@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private http = inject(HttpClient);

  private apiUrl = '/apiArcme/public/index.php/proyectos';//Se guarda esta url base de la api para utilizarla en los metodos del servicio
  // Guardar el proyecto seleccionado.
  proyectoSeleccionado: any = null;

  // Listar todos los proyectos.
  listar() {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Buscar un proyecto por su ID.
  buscar(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);

  }

  // Crear un proyecto junto con sus fotografías.
  crear(proyecto: any) {
   return this.http.post(this.apiUrl,proyecto)
  }

  agregarPortfolio(id: number) {
    return this.http.patch(`${this.apiUrl}/${id}/catalogo`, {});
  }

  // Actualizar un proyecto.
  actualizar(id: number, proyecto: any) {
    return this.http.put(`${this.apiUrl}/${id}`, proyecto);
  }

  // Eliminar un proyecto.
  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener proyectos que todavía no están vinculados.
listarDisponibles() {
  return this.http.get<any[]>(`${this.apiUrl}/disponibles`);
}

// Obtener proyectos vinculados a un cliente.
listarPorCliente(id_cliente: number) {
  return this.http.get<any[]>(`${this.apiUrl}/cliente/${id_cliente}`);
}

// Vincular un proyecto a un cliente.
vincular(id_obra: number, datos: any) {
  return this.http.patch(
    `${this.apiUrl}/${id_obra}/vincular`,
    datos
  );
}
}