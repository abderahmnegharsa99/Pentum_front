import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Produitfinancier } from 'src/app/core/models/produitfinancier.model';
import { MarcheService } from 'src/app/core/services/marche.service';
import { NewsResponse, Article } from 'src/app/core/models/news-response.model';
import { NewsService } from 'src/app/core/services/news.service';
import { HistoricalPrice } from 'src/app/core/models/historical-price.model';
import { HistoricalPriceService } from 'src/app/core/services/historical-price.service';
import { OrdreService } from 'src/app/core/services/ordre.service';
import { Typeordre } from 'src/app/core/models/typeordre';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
} from 'ng-apexcharts';
import { Portefeuille } from 'src/app/core/models/portefeuille.model';
import { PortefeuilleService } from 'src/app/core/services/portefeuille.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit {
  action$: Observable<Produitfinancier>;
  breadCrumbItems: Array<{ label: string; active?: boolean }> = [];
  news$: Observable<NewsResponse>;
  articles: Article[] = [];
  paginatedArticles: Article[] = [];
  currentPage: number = 1;
  articlesPerPage: number = 4;
  totalPages: number;
  historicalPrices: HistoricalPrice[] = [];
  chartOptions: Partial<ChartOptions>;

  portefeuille: Portefeuille | null = null;
  symboleProduit: string;
  quantite: number = 0;
  prix: number;
  typeOrdre: Typeordre;
  totalAPayer: number = 0;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private marcheService: MarcheService,
    private newsService: NewsService,
    private historicalPriceService: HistoricalPriceService,
    private ordreService: OrdreService,
    private portefeuilleService: PortefeuilleService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Crypto' },
      { label: 'Marché', active: true },
    ];

    this.loadPortefeuille();

    this.action$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const symbol = params.get('symbol');
        if (symbol) {
          this.symboleProduit = symbol;
          this.loadNews(symbol);
          this.loadHistoricalPrices(symbol);
        }
        return this.marcheService.getAction(symbol!).pipe(
          tap((action) => {
            this.prix = action.prixActuel;
          })
        );
      })
    );
  }

  loadPortefeuille(): void {
    this.portefeuilleService.getPortefeuilleById(1).subscribe({
      next: (portefeuille) => {
        this.portefeuille = portefeuille;
        console.log('Portefeuille chargé :', portefeuille);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du portefeuille :', err);
        this.message = 'Impossible de charger le portefeuille.';
      },
    });
  }

  loadNews(symbol: string): void {
    this.newsService.getNewsForSymbol(symbol).subscribe((response) => {
      if (response && response.articles) {
        this.articles = response.articles;
        this.totalPages = Math.ceil(
          this.articles.length / this.articlesPerPage
        );
        this.paginateArticles();
      }
    });
  }

  loadHistoricalPrices(symbol: string): void {
    this.historicalPriceService.getHistoricalPrices(symbol).subscribe(
      (prices) => {
        this.historicalPrices = prices;
        this.initChartOptions();
      }
    );
  }

  initChartOptions(): void {
    const seriesData = this.historicalPrices.map((price) => ({
      x: new Date(price.date).toLocaleDateString(),
      y: [price.open, price.high, price.low, price.close],
    }));

    this.chartOptions = {
      series: [
        {
          name: 'Historique des Prix',
          data: seriesData,
        },
      ],
      chart: {
        type: 'candlestick',
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      },
      xaxis: {
        type: 'datetime',
      },
      title: {
        text: 'Historique des Prix',
        align: 'left',
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    };
  }

  updateTotal(): void {
    this.totalAPayer = (this.quantite || 0) * (this.prix || 0);
  }

  placeOrder(): void {
    if (!this.portefeuille) {
      console.error('Portefeuille non chargé ou nul.');
      this.message = 'Le portefeuille n\'est pas disponible.';
      return;
    }

    if (this.quantite <= 0) {
      this.message = 'Veuillez entrer une quantité valide.';
      return;
    }

    const ordreDTO = {
      symboleProduit: this.symboleProduit,
      typeProduit: 'Action',
      quantite: this.quantite,
      prix: this.prix,
      typeOrdre: this.typeOrdre,
      idPortfeuille: this.portefeuille.idPortfeuille,
      date: new Date(),
    };

    this.ordreService.passerOrdre(ordreDTO).subscribe({
      next: (response) => {
        this.message = 'Ordre passé avec succès.';
        console.log('Ordre créé :', response);
        this.portefeuilleService.invalidateCache();
        this.loadPortefeuille();
      },
      error: (error) => {
        this.message = 'Échec de la création de l\'ordre : ' + error.message;
        console.error('Erreur :', error);
      },
    });
  }

  confirmOrder(): void {
    this.placeOrder();
  }

  paginateArticles(): void {
    const startIndex = (this.currentPage - 1) * this.articlesPerPage;
    const endIndex = startIndex + this.articlesPerPage;
    this.paginatedArticles = this.articles.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateArticles();
    }
  }

  get pageRange(): number[] {
    const rangeSize = 5;
    const start = Math.max(1, this.currentPage - Math.floor(rangeSize / 2));
    const end = Math.min(this.totalPages, start + rangeSize - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
