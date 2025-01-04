import { Injectable } from '@angular/core';
import { NewsDto } from '../models/news-dto.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsResponse } from '../models/news-response.model'; // Adjust the import to match your model
@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private readonly apiUrl = 'http://localhost:8082/api/news'; // URL de votre backend

  constructor(private http: HttpClient) {}

  getNewsForSymbol(symbol: string): Observable<NewsResponse> {
    // Adjust the endpoint to directly match the backend structure
    return this.http.get<NewsResponse>(`${this.apiUrl}?symbol=${symbol}`);
  }
}





