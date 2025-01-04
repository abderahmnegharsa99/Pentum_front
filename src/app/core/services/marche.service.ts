import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produitfinancier } from '../models/produitfinancier.model';

@Injectable({
  providedIn: 'root'
})
export class MarcheService {
  readonly apiUrl = 'http://localhost:8082'; // URL de base pour l'API
  readonly baseUrl = '/marche/actions'; // Route spécifique pour les actions

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir les actions pour un seul symbole
  getAction(symbol: string): Observable<Produitfinancier> {
    return this.http.get<Produitfinancier>(`${this.apiUrl}${this.baseUrl}/${symbol}`);
  }

  // Méthode pour obtenir les actions pour plusieurs symboles
  getActions(symbols: string[]): Observable<Produitfinancier[]> {
    // Transformer le tableau de symboles en une chaîne de requête (par ex : symbols=AAPL,GOOGL,MSFT)
    const symbolsParam = symbols.join(',');
    return this.http.get<Produitfinancier[]>(`${this.apiUrl}${this.baseUrl}?symbols=${symbolsParam}`);
  }
}
