
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface DatosRegistro {
  dni: string;
  contrasena: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private http = inject(HttpClient);

  private apiUrl = '/apiArcme/public/index.php/usuarios';

  registrar(
    datos: DatosRegistro
  ){
    return this.http.post<{ mensaje?: string; error?: string }>(
      this.apiUrl,
      datos
    );
  }
  verificarDni(dni: string) {
  return this.http.post<{ existe: boolean }>(
    '/apiArcme/public/index.php/verificar-dni',
    { dni }
  );
}
}
