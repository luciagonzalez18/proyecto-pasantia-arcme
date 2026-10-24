
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private http = inject(HttpClient);

  private apiUrl = '/api_proyectoLucia/public/index.php/proyectos';

  listar() {
    return this.http.get(this.apiUrl);
  }

  buscar(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  crear(proyecto: any) {
    return this.http.post(this.apiUrl, proyecto);
  }

  actualizar(id: number, proyecto: any) {
    return this.http.put(`${this.apiUrl}/${id}`, proyecto);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
