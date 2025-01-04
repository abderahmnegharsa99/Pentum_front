export class Produitfinancier {
    symbole: string;
    type: string; // Peut être "Action" ou "Obligation"
    prixActuel: number; // Prix de clôture
    prixOuverture: number; // Prix d'ouverture
    prixHaut: number; // Prix le plus haut
    prixBas: number; // Prix le plus bas
    volume: number; // Volume d'échange
    exchange: string; // Marché
    currency: string; // Devise
    derniereMiseAJour: string; // Date et heure de la donnée
  
    constructor(data: Partial<Produitfinancier> = {}) {
      Object.assign(this, data);
    }
}
