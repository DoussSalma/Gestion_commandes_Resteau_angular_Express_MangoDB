export class Categorie {
  id?: string;
  nom: string = '';
  description: string = '';
  icone: string = '🍽️';
}

export class Plat {
  id?: string;
  nom: string = '';
  description: string = '';
  prix: number = 0;
  image: string = '';
  disponible: boolean = true;
  categorie?: string | Categorie;
}

export class LigneCommande {
  plat?: string | Plat;
  nomPlat: string = '';
  prixUnitaire: number = 0;
  quantite: number = 1;
  sousTotal: number = 0;
}

export class Commande {
  id?: string;
  numeroTable: number = 1;
  client: string = 'Client';
  lignes: LigneCommande[] = [];
  total: number = 0;
  statut: string = 'en_attente';
  notes: string = '';
  createdAt?: string;
}

export class PanierItem {
  plat!: Plat;
  quantite: number = 1;
  sousTotal: number = 0;
}
