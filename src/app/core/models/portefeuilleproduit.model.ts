// portefeuille-produit.model.ts
import { Portefeuille } from './portefeuille.model';

export class PortefeuilleProduit {
  id: number;
  symboleProduit: string; // Symbole du produit financier (ex: AAPL pour une action ou OBL123 pour une obligation)
  typeProduit: string; // "Action" ou "Obligation"
  quantite: number; // Quantité que l'utilisateur possède
  prixAchat: number; // Prix d'achat du produit financier
  portefeuille: Portefeuille; // Relation avec le portefeuille de l'utilisateur

  constructor(data: Partial<PortefeuilleProduit> = {}) {
    Object.assign(this, data);
  }
}
