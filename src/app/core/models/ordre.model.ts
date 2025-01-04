import { Typeordre } from './typeordre';
import { Marche } from './marche.model';
import { Portefeuille } from './portefeuille.model';

export class Ordre {
  idOrdre?: number; // Marked optional if not required during initialization
  symboleProduit: string;
  typeProduit: string;
  date?: Date; // Optional during creation, backend can set this
  prix: number;
  quantite: number;
  typeOrdre: Typeordre;
  marche?: Marche; // Optional if not passed directly
  portefeuille?: Portefeuille; 
  //portefeuilleId?: number = 1;

  constructor(data: Partial<Ordre> = {}) {
    Object.assign(this, data);
  }
}
