import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Agenda {

  private http = inject(HttpClient);

  // dirección completa de la API (con http://localhost adelante)
  private apiUrl = '/apiArcme/public/index.php/agenda';

  // pide todos los eventos
  listar() {
    return this.http.get<any[]>(this.apiUrl);
  }

  // manda un evento nuevo para guardarlo
  crear(evento: any) {
    return this.http.post(this.apiUrl, evento);
  }

  // manda los datos nuevos de un evento que ya existe
  editar(id: number, evento: any) {
    return this.http.put(`${this.apiUrl}/${id}`, evento);
  }

  // borra un evento por su id
  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}