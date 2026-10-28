import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private http = inject(HttpClient);

  private apiUrl = '/apiArcme/public/index.php/proyectos';

  // Listar todos los proyectos.
  listar() {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Buscar un proyecto por su ID.
  buscar(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un proyecto junto con sus fotografías.
  crear(proyecto: any, fotos: File[]) {
    const formData = new FormData();

    // Agregar los datos del proyecto.
    Object.keys(proyecto).forEach((campo) => {
      const valor = proyecto[campo];

      if (valor !== null && valor !== undefined) {
        formData.append(campo, String(valor));
      }
    });

    // Agregar las fotografías.
    fotos.forEach((foto) => {
      formData.append('fotos[]', foto);
    });

    return this.http.post(this.apiUrl, formData);
  }

  // Cambiar la visibilidad en el catálogo.
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
}