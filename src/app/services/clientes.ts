import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private http = inject(HttpClient);
  private apiUrl = '/apiArcme/public/index.php/clientes';


  clienteSeleccionado: any = null;


  listar(){
    return this.http.get(this.apiUrl);
  }

  buscar(id: number){
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  crear(cliente: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Enviamos explícitamente los headers para que PHP reciba el JSON correctamente
    return this.http.post(this.apiUrl, cliente, { headers });
  }

  actualizar(id: number, cliente: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}/${id}`, cliente, { headers });
  }

  eliminar(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}