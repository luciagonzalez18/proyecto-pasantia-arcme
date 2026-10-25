
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';//Para poder hacer peticiones http

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private http = inject(HttpClient);

  private apiUrl = '/api_proyectoLucia/public/index.php/proyectos';//Se guarda esta url base de la api para utilizarla en los metodos del servicio

  listar() {
    return this.http.get(this.apiUrl);
    // this.http.get()   realiza una peticion HTTp de tipo get para consultar los datitos
    //(this.apiUrl)      contiene la url del endpoint de proyectos
    //return http://localhost/api_proyectoLucia/public/index.php/proyectos  esa seria la url completa de la peticion :v
    //Se retorna un observable:Para obtener los datos hay que suscribirse desde quien llame al metodo --- se suscribe desde el componente proyectos.ts
    //.subscribe() :Permite recibir los valores de un Observable, sin subscribe la peticion HTTP en angular no se ejecuta
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
