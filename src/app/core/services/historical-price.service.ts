// src/app/services/historical-price.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HistoricalPrice } from '../models/historical-price.model';

@Injectable({
  providedIn: 'root'
})
export class HistoricalPriceService {
  private apiUrl = 'http://localhost:8082/api/historical';

  constructor(private http: HttpClient) { }

  getHistoricalPrices(symbol: string): Observable<HistoricalPrice[]> {
    return this.http.get<HistoricalPrice[]>(`${this.apiUrl}/${symbol}`).pipe(
      map(data => data.map(item => ({
        ...item,
        date: new Date(item.date) // Ensure the date is parsed as a Date object
      })))
    );
  }
}
