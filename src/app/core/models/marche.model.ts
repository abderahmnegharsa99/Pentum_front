// marche.model.ts
import { Statutmarche } from './statutmarche';
import { Devise } from './devise';
import { Ordre } from './ordre.model';

export class Marche {
  idMarche: number;
  nomMarche: string;
  pays: string;
  devisePrincipale: Devise;
  heureOuverture: string;
  heureCloture: string;
  statutMarche: Statutmarche;
  ordres: Ordre[]; // Liste des ordres associés à ce marché

  constructor(data: Partial<Marche> = {}) {
    Object.assign(this, data);
  }
}
