import { Component, OnInit } from '@angular/core';
import { PortefeuilleService } from 'src/app/core/services/portefeuille.service';
import { ChartType } from '../../chart/apex/apex.model';

@Component({
  selector: 'app-kycapplication',
  templateUrl: './kycapplication.component.html',
  styleUrls: ['./kycapplication.component.scss']
})
export class KycapplicationComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  lineColumAreaChart: ChartType;
  bubbleChart: ChartType;
  barChart: ChartType;
  pieChart: ChartType;

  rendementGlobal: number;
  rendementsParProduit: { [key: string]: number };
  valeursTotales: { [key: string]: number };
  gainPerteRatio: number;

  successMessage: string;

  constructor(private portefeuilleService: PortefeuilleService) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Crypto' }, { label: 'KYC Application', active: true }];
    this.loadChartsData(1); // Remplacez `1` par l'ID du portefeuille que vous voulez charger
  }

  private loadChartsData(portefeuilleId: number): void {
    // Charger les rendements par produit
    this.portefeuilleService.getRendementsParProduit(portefeuilleId).subscribe((rendements) => {
      this.rendementsParProduit = rendements;
      this.lineColumAreaChart = this.getLineColumAreaChartConfig(Object.keys(rendements), Object.values(rendements));
      this.barChart = this.getBarChartConfig(Object.keys(rendements), Object.values(rendements));
    });

    // Charger les poids des produits
    this.portefeuilleService.getPoidsProduits(portefeuilleId).subscribe((poids) => {
      this.pieChart = this.getPieChartConfig(Object.keys(poids), Object.values(poids));
    });

    // Charger les profits ou pertes par produit
    this.portefeuilleService.getProfitOuPerte(portefeuilleId).subscribe((profitsOuPertes) => {
      this.bubbleChart = this.getBubbleChartConfig(Object.keys(profitsOuPertes), Object.values(profitsOuPertes));
    });

    // Charger le rendement global
    this.portefeuilleService.getRendementGlobal(portefeuilleId).subscribe((rendementGlobal) => {
      this.rendementGlobal = rendementGlobal;
    });

    // Charger le ratio gain/perte
    this.portefeuilleService.getRatioGainPerte(portefeuilleId).subscribe((ratio) => {
      this.gainPerteRatio = ratio;
    });

    // Charger les valeurs totales
    this.portefeuilleService.getValeursTotales(portefeuilleId).subscribe((valeurs) => {
      this.valeursTotales = valeurs;
    });
  }

  // Sauvegarder les rendements
  sauvegarderRendements(portefeuilleId: number): void {
    this.portefeuilleService.sauvegarderRendements(portefeuilleId).subscribe({
      next: () => {
        this.successMessage = 'Les rendements ont été sauvegardés avec succès !';
        setTimeout(() => (this.successMessage = ''), 3000); // Efface le message après 3 secondes
      },
      error: (err) => {
        console.error('Erreur lors de la sauvegarde des rendements :', err);
      }
    });
  }

  private getLineColumAreaChartConfig(labels: string[], data: number[]): ChartType {
    return {
      chart: { type: 'line', height: 350 },
      series: [{ name: 'Rendements (%)', data }],
      xaxis: { categories: labels },
      yaxis: { title: { text: 'Rendement (%)' } },
      colors: ['#1c92d2', '#f46a6a', '#34c38f'],
    };
  }

  private getBubbleChartConfig(labels: string[], data: number[]): ChartType {
    return {
      chart: { type: 'bubble', height: 350 },
      series: [{ name: 'Profit/Perte', data: data.map((value, index) => ({ x: labels[index], y: value, z: Math.abs(value) })) }],
      xaxis: { categories: labels },
      colors: ['#f46a6a']
    };
  }

  private getBarChartConfig(labels: string[], data: number[]): ChartType {
    return {
      chart: { type: 'bar', height: 350 },
      series: [{ name: 'Rendements (%)', data }],
      xaxis: { categories: labels },
      colors: ['#34c38f']
    };
  }

  private getPieChartConfig(labels: string[], data: number[]): ChartType {
    return {
      chart: { type: 'pie', height: 350 },
      series: data,
      labels,
      colors: ['#1c92d2', '#34c38f', '#f46a6a', '#f1b44c']
    };
  }
}
