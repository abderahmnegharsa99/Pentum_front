// portefeuille.model.ts
import { User } from "./auth.models";
import { Ordre } from './ordre.model';

export class Portefeuille {
  idPortfeuille?: number=1;
  dateOuverture: Date;
  solde: number;
  user: User; // Relation avec l'utilisateur
  ordres: Ordre[]; // Liste des ordres associés

  constructor(data: Partial<Portefeuille> = {}) {
    Object.assign(this, data);
  }
}
