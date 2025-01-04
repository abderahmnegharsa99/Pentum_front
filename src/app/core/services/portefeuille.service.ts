import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Portefeuille } from '../models/portefeuille.model';

@Injectable({
  providedIn: 'root',
})
export class PortefeuilleService {
  private apiUrl = 'http://localhost:8082/api/portefeuilles';
  private cache: Portefeuille | null = null;

  constructor(private http: HttpClient) {}

  // Récupérer un portefeuille par ID
  getPortefeuilleById(id: number): Observable<Portefeuille> {
    if (this.cache) {
      console.log('Chargement depuis le cache');
      return of(this.cache);
    }
    console.log('Chargement depuis l\'API');
    return this.http.get<Portefeuille>(`${this.apiUrl}/${id}`).pipe(
      tap((portefeuille) => (this.cache = portefeuille))
    );
  }

  // Invalider le cache
  invalidateCache(): void {
    this.cache = null;
  }

  // Récupérer les rendements par produit
  getRendementsParProduit(id: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/${id}/rendements`);
  }

  // Récupérer les valeurs totales par produit
  getValeursTotales(id: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/${id}/valeurs-totales`);
  }

  // Récupérer le profit ou perte par produit
  getProfitOuPerte(id: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/${id}/profit-ou-perte`);
  }

  // Récupérer le rendement global du portefeuille
  getRendementGlobal(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/rendement-global`);
  }

  // Sauvegarder les rendements dans l'historique
  sauvegarderRendements(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/sauvegarder-rendements`, {});
  }

  // Récupérer le ratio gain/perte
  getRatioGainPerte(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/ratio-gain-perte`);
  }

  // Récupérer le poids des produits
  getPoidsProduits(id: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/${id}/poids-produits`);
  }
}
