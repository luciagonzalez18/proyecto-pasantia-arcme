import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private http = inject(HttpClient);

  private apiUrl = '/apiArcme/public/index.php/catalogo';


  listarPortfolio(){
    return this.http.get(this.apiUrl);
  }
}
