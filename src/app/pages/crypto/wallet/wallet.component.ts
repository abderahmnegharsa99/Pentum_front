import { Component, OnInit } from '@angular/core';
import { OrdreService } from 'src/app/core/services/ordre.service';
import { Ordre } from 'src/app/core/models/ordre.model';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  orders: Ordre[] = []; // Array to store user orders

  constructor(private ordreService: OrdreService) {}

  ngOnInit(): void {
    // Fetch all orders for the user
    this.ordreService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error("Error fetching orders:", err);
      }
    });
  }
}
