import { Component, OnInit } from '@angular/core';
import { OrdreService } from 'src/app/core/services/ordre.service';
import { Ordre } from 'src/app/core/models/ordre.model';
@Component({
  selector: 'app-lending',
  templateUrl: './lending.component.html',
  styleUrls: ['./lending.component.scss']
})
export class LendingComponent implements OnInit {

  // breadcrumb items
  breadCrumbItems: Array<{}>;
  orders: Ordre[] = []; 
  constructor(private ordreService: OrdreService) { }
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Crypto' }, { label: 'Lending', active: true }];
    this.loadOrders();
  }
 // Load all orders from the backend
 loadOrders() {
  this.ordreService.getAllOrders().subscribe(
    (data: Ordre[]) => {
      this.orders = data;
    },
    error => {
      console.error('Error fetching orders', error);
    }
  );
}

// Accept an order
acceptOrder(id: number) {
  this.ordreService.accepterOrdre(id).subscribe(
    response => {
      this.loadOrders(); // Reload orders to update status
    },
    error => {
      console.error('Error accepting order', error);
    }
  );
}

// Reject an order
rejectOrder(id: number) {
  this.ordreService.refuserOrdre(id).subscribe(
    response => {
      this.loadOrders(); // Reload orders to update status
    },
    error => {
      console.error('Error rejecting order', error);
    }
  );
}
}



 

 
