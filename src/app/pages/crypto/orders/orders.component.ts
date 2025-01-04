import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { OrderSortableService, SortEvent } from './orders-sortable.directive';
import { MarcheService } from 'src/app/core/services/marche.service';
import { Produitfinancier } from 'src/app/core/models/produitfinancier.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [MarcheService]
})
export class OrdersComponent implements OnInit {
  // Breadcrumb items
  breadCrumbItems: Array<{}>;

  // Observable pour les données du marché
  marcheData$: Observable<Produitfinancier[]>;
  @ViewChildren(OrderSortableService) headers: QueryList<OrderSortableService>;

  constructor(private marcheService: MarcheService, private router: Router) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Crypto' }, { label: 'Marché', active: true }];

    // Appel pour récupérer les données du marché pour plusieurs symboles
    const symbols = [ 'AAPL', 'MSFT', 'GOOGL','AMR' /*'AMZN', /*'TSLA', 'META', 'NVDA', 'NFLX'*/]; // Liste de symboles que vous voulez récupérer
    this.marcheData$ = this.marcheService.getActions(symbols);
  }
  viewActionDetails(symbol: string): void {
    this.router.navigate(['/crypto/exchange', symbol]); // Navigation vers les détails de l'action
}
  /**
   * Sort table data
   * @param param0 sort the column
   */
  onSort({ column, direction }: SortEvent) {
    // Réinitialiser les autres headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // Logique de tri (peut être implémentée dans le service si nécessaire)
  }
}
