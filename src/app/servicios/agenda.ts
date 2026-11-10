import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

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




  // pide los eventos y devuelve solo los de los próximos 7 días
proximos() {
  return this.listar().pipe(
    map(datos => {
      // recorta la hora "10:00:00" a "10:00"
      const eventos = datos.map(ev => ({ ...ev, hora: ev.hora.slice(0, 5) }));

      const hoyStr = this.fechaTexto(new Date());
      const semana = new Date();
      semana.setDate(semana.getDate() + 7);
      const semanaStr = this.fechaTexto(semana);

      return eventos
        .filter(ev => ev.fecha >= hoyStr && ev.fecha <= semanaStr)
        .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
    })
  );
}

// convierte una fecha en el formato año-mes-dia
private fechaTexto(fecha: Date): string {
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
}