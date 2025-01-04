import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ordre } from '../models/ordre.model';
import { OrdreDTO } from '../models/ordre-dto';

@Injectable({
  providedIn: 'root'
})
export class OrdreService {

  private apiUrl = 'http://localhost:8082/api/ordres'; // Adjust the URL as necessary

  constructor(private http: HttpClient) {}

  // Method to pass an order
  passerOrdre(ordreDTO: OrdreDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/passer`, ordreDTO);
  }

  // Method to retrieve orders that are pending approval
  getOrdresEnAttente(): Observable<Ordre[]> {
    return this.http.get<Ordre[]>(`${this.apiUrl}/en-attente`);
  }

  // Method for the admin to accept an order
  accepterOrdre(id: number): Observable<Ordre> {
    return this.http.post<Ordre>(`${this.apiUrl}/accepter/${id}`, {});
  }

  // Method for the admin to reject an order
  refuserOrdre(id: number): Observable<Ordre> {
    return this.http.post<Ordre>(`${this.apiUrl}/rejeter/${id}`, {});
  }
   // Method to get orders for the current authenticated user
   getOrdersForCurrentUser(): Observable<Ordre[]> {
    return this.http.get<Ordre[]>(`${this.apiUrl}/user-orders`);
  }
  getAllOrders(): Observable<Ordre[]> {
    return this.http.get<Ordre[]>(`${this.apiUrl}/all`);
  }
}
