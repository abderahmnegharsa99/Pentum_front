import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-buysell',
  templateUrl: './buysell.component.html',
  styleUrls: ['./buysell.component.scss']
})
export class BuysellComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  currencies: string[] = ['USD', 'EUR', 'TND']; // Supported currencies
  fromCurrency: string = 'USD';
  toCurrency: string = 'EUR';
  amount: number = 1;
  convertedAmount: number | null = null;
  exchangeRate: number | null = null;
  historicalData: { date: string; rate: number }[] = [];
  chartOptions: any;

  private apiKey: string = '0e2bd259a1msh9db386f123c5db1p1b0073jsn08d92e617e81'; // Replace with your actual API key

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Crypto' }, { label: 'Buy/Sell', active: true }];
    this.fetchHistoricalData(); // Fetch historical data on initialization
  }

  convertCurrency(): void {
    const url = `https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert?from=${this.fromCurrency}&to=${this.toCurrency}&amount=${this.amount}`;
    const headers = {
      'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com',
      'x-rapidapi-key': this.apiKey
    };

    this.http.get<any>(url, { headers }).subscribe(
      (response) => {
        this.convertedAmount = response.result;
        this.exchangeRate = response.info.rate;
      },
      (error) => {
        console.error('Error fetching currency conversion:', error);
      }
    );
  }

  fetchHistoricalData(): void {
    const url = `https://currency-conversion-and-exchange-rates.p.rapidapi.com/2019-10-16?from=${this.fromCurrency}&to=${this.toCurrency}`;
    const headers = {
      'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com',
      'x-rapidapi-key': this.apiKey
    };
  
    this.http.get<any>(url, { headers }).subscribe(
      (response) => {
        const rates = response.rates;
        this.historicalData = Object.entries(rates).map(([date, rate]) => ({
          date,
          rate: rate as number // Explicitly casting the rate to a number
        }));
        this.updateChart();
      },
      (error) => {
        console.error('Error fetching historical data:', error);
      }
    );
  }
  

  updateChart(): void {
    this.chartOptions = {
      series: [
        {
          name: `${this.fromCurrency} to ${this.toCurrency}`,
          data: this.historicalData.map((data) => data.rate)
        }
      ],
      chart: {
        height: 350,
        type: 'line'
      },
      xaxis: {
        categories: this.historicalData.map((data) => data.date),
        title: {
          text: 'Date'
        }
      },
      yaxis: {
        title: {
          text: 'Exchange Rate'
        }
      },
      title: {
        text: `Historical Exchange Rates (${this.fromCurrency} to ${this.toCurrency})`,
        align: 'left'
      },
      colors: ['#FF1493']
    };
  }
}
