import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { Plat, Categorie, PanierItem } from '../../../models/models';

@Component({
  selector: 'app-plat-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plat-detail.component.html'
})
export class PlatDetailComponent implements OnInit {
  plat: Plat | null = null;
  categories: Categorie[] = [];
  panier: PanierItem[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: RestaurantService
  ) {}

  ngOnInit(): void {
    // Récupérer l'id depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/plats']); return; }

    // Charger le plat par ID
    this.service.getPlatById(id).subscribe(
      (data: Plat) => { this.plat = data; this.loading = false; },
      (err: any) => { console.error(err); this.router.navigate(['/plats']); }
    );

    // Charger les catégories pour afficher le nom
    this.service.getAllCategories().subscribe(
      (data: Categorie[]) => this.categories = data,
      (err: any) => console.error(err)
    );

    // Charger le panier depuis le localStorage
    const savedPanier = localStorage.getItem('panier');
    if (savedPanier) this.panier = JSON.parse(savedPanier);
  }

  // Retourner à la liste des plats
  retour(): void {
    this.router.navigate(['/plats']);
  }

  // Ajouter le plat au panier
  ajouterAuPanier(): void {
    if (!this.plat) return;
    const item = this.panier.find((p: PanierItem) => p.plat.id === this.plat!.id);
    if (item) {
      item.quantite++;
      item.sousTotal = item.quantite * item.plat.prix;
    } else {
      this.panier.push({ plat: this.plat, quantite: 1, sousTotal: this.plat.prix });
    }
    localStorage.setItem('panier', JSON.stringify(this.panier));
    alert(`✅ "${this.plat.nom}" ajouté au panier!`);
  }

  // Obtenir le nom de la catégorie
  getCategorieNom(): string {
    if (!this.plat) return 'N/A';
    if (typeof this.plat.categorie === 'object') return (this.plat.categorie as Categorie).nom;
    const cat = this.categories.find((c: Categorie) => c.id === this.plat!.categorie);
    return cat ? cat.nom : 'N/A';
  }

  // Obtenir l'icone de la catégorie
  getCategorieIcone(): string {
    if (!this.plat) return '🍽️';
    if (typeof this.plat.categorie === 'object') return (this.plat.categorie as Categorie).icone || '🍽️';
    const cat = this.categories.find((c: Categorie) => c.id === this.plat!.categorie);
    return cat ? cat.icone || '🍽️' : '🍽️';
  }
}