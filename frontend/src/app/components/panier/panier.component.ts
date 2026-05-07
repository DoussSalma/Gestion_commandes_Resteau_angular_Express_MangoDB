import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { PanierItem } from '../../models/models';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panier.component.html'
})
export class PanierComponent implements OnInit {
  panier: PanierItem[] = [];
  total = 0;
  formCommande!: FormGroup;

  constructor(
    private service: RestaurantService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('panier');
    if (saved) this.panier = JSON.parse(saved);
    this.calcTotal();
    this.formCommande = this.fb.group({
      numeroTable: [1, [Validators.required, Validators.min(1)]],
      client: ['', Validators.required],
      notes: ['']
    });
  }
  //calcul montant total des commandes dans le panier
  calcTotal(): void {
    this.total = this.panier.reduce((sum, item) => sum + item.sousTotal, 0);
  }
  //ajout +1 (quantité dans le panier) donc le prix sera *2 etc 
  incrementer(item: PanierItem): void {
    item.quantite++;
    item.sousTotal = item.quantite * item.plat.prix;
    this.save();
  }

  decrementer(item: PanierItem): void {
    if (item.quantite <= 1) return;
    item.quantite--;
    item.sousTotal = item.quantite * item.plat.prix;
    this.save();
  }

  supprimer(index: number): void {
    this.panier.splice(index, 1);
    this.save();
  }

  vider(): void {
    if (!confirm('Vider le panier?')) return;
    this.panier = [];
    this.save();
  }

  save(): void {
    localStorage.setItem('panier', JSON.stringify(this.panier));
    this.calcTotal();
  }

  passer(): void {
    if (this.formCommande.invalid || this.panier.length === 0) return;

    const data = {
      ...this.formCommande.value,
      lignes: this.panier.map(item => ({
        plat: item.plat.id,
        quantite: item.quantite
      }))
    };

    this.service.createCommande(data).subscribe(
      () => {
        alert('✅ Commande passée avec succès!');
        this.panier = [];
        localStorage.removeItem('panier');
        this.router.navigate(['/commandes']);
      },
      err => alert('Erreur: ' + JSON.stringify(err.error))
    );
  }
}
