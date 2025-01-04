import { TestBed } from '@angular/core/testing';

import { HistoricalPriceService } from './historical-price.service';

describe('HistoricalPriceService', () => {
  let service: HistoricalPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricalPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
