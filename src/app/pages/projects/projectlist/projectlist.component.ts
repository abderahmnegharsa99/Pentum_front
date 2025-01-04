import { Component, OnInit } from '@angular/core';
import { PortefeuilleService } from 'src/app/core/services/portefeuille.service';

@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss'],
})
export class ProjectlistComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  portefeuille: any; // For storing the portfolio data
  rendementGlobal: number;
  totalValue: number;
  profitLoss: { name: string; value: number }[] = [];
  poidsProduitsSeries: number[] = [];
  poidsProduitsLabels: string[] = [];
  ratioGainPerte: number;
  liquidite: number; // Portfolio liquidity
  totalAmount: number; // Total (liquidity + profit/loss)

  constructor(private portefeuilleService: PortefeuilleService) {}

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'Portfolio', active: true }];
    this.loadPortfolio(1); // Replace `1` with the actual portfolio ID
  }

  private loadPortfolio(portefeuilleId: number): void {
    // Load Portfolio Data
    this.portefeuilleService.getPortefeuilleById(portefeuilleId).subscribe((data) => {
      this.portefeuille = data;
      this.liquidite = this.portefeuille.liquidite;
    });

    // Load Global Rendement
    this.portefeuilleService.getRendementGlobal(portefeuilleId).subscribe((data) => {
      this.rendementGlobal = data;
    });

    // Load Total Portfolio Value
    this.portefeuilleService.getValeursTotales(portefeuilleId).subscribe((data) => {
      this.totalValue = Object.values(data).reduce((a: number, b: number) => a + b, 0);
    });

    // Load Profit or Loss
    this.portefeuilleService.getProfitOuPerte(portefeuilleId).subscribe((data) => {
      this.profitLoss = Object.entries(data).map(([key, value]) => ({
        name: key,
        value: value as number,
      }));
    });

    // Load Weights of Products
    this.portefeuilleService.getPoidsProduits(portefeuilleId).subscribe((data) => {
      this.poidsProduitsSeries = Object.values(data);
      this.poidsProduitsLabels = Object.keys(data);
    });

    // Load Ratio Gain/Perte
    this.portefeuilleService.getRatioGainPerte(portefeuilleId).subscribe((data) => {
      this.ratioGainPerte = data;
    });

    // Calculate Total Amount (Liquidity + Rendement Global)
    this.totalAmount = this.liquidite;
    if (this.rendementGlobal) {
      this.totalAmount += this.totalValue * (this.rendementGlobal / 100);
    }
  }

  // Simulate Sell Action
  sellProduct(productName: string): void {
    alert(`Vente simulée pour ${productName}`);
  }
}
