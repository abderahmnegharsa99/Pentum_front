export interface OrdreDTO {
    symboleProduit: string;
    typeProduit: string;
    prix: number;
    quantite: number;
    typeOrdre: string;
    idPortfeuille: number; // ID du portefeuille uniquement
    date: Date;
  }
  